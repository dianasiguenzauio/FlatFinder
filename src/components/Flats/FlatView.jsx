//Componente para ver mis flats
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import styled from "styled-components";

// Estilos del contenedor general, tabla y formulario
const Container = styled.div`
  margin-right: 10px;

  display: flex;
  flex-direction: column; /* Cambia a columna en pantallas pequeñas */
  align-items: center;
  padding: 20px;
  @media (min-width: 768px) {
    flex-direction: row; /* Cambia a fila en pantallas grandes */
    justify-content: space-between;
  }
`;

const TableWrapper = styled.div`
  flex: 2;
  margin-right: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const FormWrapper = styled.div`
  padding-top: 10%;
  background-color: #353636;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  background-color: #dddddd;
`;

const TableHeader = styled.th`
  background-color: #6aa9bb;
  color: #ffffff;
  text-align: left;
  padding: 12px;
`;

const TableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: #cecece;
  }

  &:hover {
    background-color: #cecece;
  }
`;

const TableData = styled.td`
  padding: 12px;
`;

const Button = styled.button`
  background-color: #5e17a9;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #cecece;
  }
  margin-right: 10px;
`;

const FormContainer = styled.div`
  max-width: 500px;
  max-height: max-content;
  margin: 5px auto;
  padding: 20px;
  background-color: #cecece;

  border-radius: 10px;
`;

const FormLabel = styled.label`
  display: block;
  margin: 10px 0 5px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #5193ce;
  border-radius: 5px;
  padding-top: 1%;
`;

const FormButton = styled.button`
  position: flex;
  max-height: 10%;
  margin-right: 10px; /* Espacio entre los botones */
  background-color: #4caf50;
  color: white;
  padding: 4px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: #5193ce;
  }
`;

function MyFlats() {
  const [flats, setFlats] = useState([]);
  const [editingFlat, setEditingFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        const flatsQuery = query(
          collection(db, "flats"),
          where("userEmail", "==", storedUser.email)
        );

        const querySnapshot = await getDocs(flatsQuery);
        const flatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los flats: ", err);
        setError("Error al cargar los flats. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchFlats();
  }, []);

  const handleEditClick = (flat) => {
    setEditingFlat(flat);
  };

  const handleUpdateFlat = async (e) => {
    e.preventDefault();
    if (!editingFlat) return;

    try {
      const flatRef = doc(db, "flats", editingFlat.id);
      await updateDoc(flatRef, { ...editingFlat });

      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat.id === editingFlat.id ? { ...editingFlat } : flat
        )
      );

      setEditingFlat(null);
      setSuccessMessage("Flat actualizado.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error al actualizar el flat: ", err);
      setError("Error al actualizar el flat. Por favor, intenta nuevamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let valid = true;

    if (name === "city" || name === "streetname") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        valid = false;
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Solo se permiten letras.",
        }));
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }

    if (
      name === "streetnumber" ||
      name === "areasize" ||
      name === "yearbuilt" ||
      name === "rentprice"
    ) {
      if (!/^\d*$/.test(value)) {
        valid = false;
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Solo se permiten números.",
        }));
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }

    if (valid) {
      setEditingFlat((prevFlat) => ({
        ...prevFlat,
        [name]: value,
      }));
    }
  };

  const handleDeleteFlat = async (flatId) => {
    try {
      await deleteDoc(doc(db, "flats", flatId));

      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
      setSuccessMessage("Flat eliminado.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error al eliminar el flat: ", err);
      setError("Error al eliminar el flat. Por favor, intenta nuevamente.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <Container>
      <TableWrapper>
        <h2 style={{ textAlign: "center" }}>Mis Propiedades</h2>
        {successMessage && (
          <p style={{ color: "green", textAlign: "center" }}>
            {successMessage}
          </p>
        )}
        {flats.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <TableHeader>Ciudad</TableHeader>
                <TableHeader>Calle</TableHeader>
                <TableHeader>Número</TableHeader>
                <TableHeader>Área (m²)</TableHeader>
                <TableHeader>Aire Acondicionado</TableHeader>
                <TableHeader>Año de Construcción</TableHeader>
                <TableHeader>Precio de Renta</TableHeader>
                <TableHeader>Fecha Disponible</TableHeader>
                <TableHeader>Acciones</TableHeader>
              </tr>
            </thead>
            <tbody>
              {flats.map((flat) => (
                <TableRow key={flat.id}>
                  <TableData>{flat.city}</TableData>
                  <TableData>{flat.streetname}</TableData>
                  <TableData>{flat.streetnumber}</TableData>
                  <TableData>{flat.areasize}</TableData>
                  <TableData>{flat.hasac ? "Sí" : "No"}</TableData>
                  <TableData>{flat.yearbuilt}</TableData>
                  <TableData>{flat.rentprice}</TableData>
                  <TableData>{flat.dateavaliable}</TableData>
                  <TableData>
                    <Button onClick={() => handleEditClick(flat)}>
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteFlat(flat.id)}>
                      Eliminar
                    </Button>
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No tienes flats registrados.</p>
        )}
      </TableWrapper>

      {editingFlat && (
        <FormWrapper>
          <FormContainer>
            <h2>Editar Flat</h2>
            <form onSubmit={handleUpdateFlat}>
              <FormLabel>
                Ciudad:
                <FormInput
                  type="text"
                  name="city"
                  value={editingFlat.city}
                  onChange={handleChange}
                />
                {fieldErrors.city && (
                  <p style={{ color: "red" }}>{fieldErrors.city}</p>
                )}
              </FormLabel>
              <FormLabel>
                Calle:
                <FormInput
                  type="text"
                  name="streetname"
                  value={editingFlat.streetname}
                  onChange={handleChange}
                />
                {fieldErrors.streetname && (
                  <p style={{ color: "red" }}>{fieldErrors.streetname}</p>
                )}
              </FormLabel>
              <FormLabel>
                Número:
                <FormInput
                  type="number"
                  name="streetnumber"
                  value={editingFlat.streetnumber}
                  onChange={handleChange}
                />
                {fieldErrors.streetnumber && (
                  <p style={{ color: "red" }}>{fieldErrors.streetnumber}</p>
                )}
              </FormLabel>
              <FormLabel>
                Área (m²):
                <FormInput
                  type="number"
                  name="areasize"
                  value={editingFlat.areasize}
                  onChange={handleChange}
                />
                {fieldErrors.areasize && (
                  <p style={{ color: "red" }}>{fieldErrors.areasize}</p>
                )}
              </FormLabel>
              <FormLabel>
                Aire Acondicionado:
                <input
                  type="checkbox"
                  name="hasac"
                  checked={editingFlat.hasac}
                  onChange={(e) =>
                    setEditingFlat((prevFlat) => ({
                      ...prevFlat,
                      hasac: e.target.checked,
                    }))
                  }
                />
              </FormLabel>
              <FormLabel>
                Año de Construcción:
                <FormInput
                  type="number"
                  name="yearbuilt"
                  value={editingFlat.yearbuilt}
                  onChange={handleChange}
                />
                {fieldErrors.yearbuilt && (
                  <p style={{ color: "red" }}>{fieldErrors.yearbuilt}</p>
                )}
              </FormLabel>
              <FormLabel>
                Precio de Renta:
                <FormInput
                  type="number"
                  name="rentprice"
                  value={editingFlat.rentprice}
                  onChange={handleChange}
                />
                {fieldErrors.rentprice && (
                  <p style={{ color: "red" }}>{fieldErrors.rentprice}</p>
                )}
              </FormLabel>
              <FormLabel>
                Fecha Disponible:
                <FormInput
                  type="date"
                  name="dateavaliable"
                  value={editingFlat.dateavaliable}
                  onChange={handleChange}
                />
              </FormLabel>
              <FormButton type="submit">Actualizar Flat</FormButton>

              <FormButton
                type="button"
                style={{ backgroundColor: "#aa0101", color: "#ffffff" }}
                onClick={() => setEditingFlat(null)}
              >
                Cancelar
              </FormButton>
            </form>
          </FormContainer>
        </FormWrapper>
      )}
    </Container>
  );
}

export default MyFlats;
