//Componente para ver los detalles del flat
/*
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

function MyFlats() {
  const [flats, setFlats] = useState([]);
  const [editingFlat, setEditingFlat] = useState(null); // Estado para el flat en edición
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener los flats del usuario
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
  }, [storedUser]);

  const handleEditClick = (flat) => {
    setEditingFlat(flat); // Establecer el flat que se está editando
  };

  const handleUpdateFlat = async (e) => {
    e.preventDefault();
    if (!editingFlat) return;

    try {
      // Actualizar el documento en Firestore
      const flatRef = doc(db, "flats", editingFlat.id);
      await updateDoc(flatRef, { ...editingFlat });

      // Actualizar la lista de flats en el estado
      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat.id === editingFlat.id ? { ...editingFlat } : flat
        )
      );

      setEditingFlat(null); // Limpiar el estado de edición
    } catch (err) {
      console.error("Error al actualizar el flat: ", err);
      setError("Error al actualizar el flat. Por favor, intenta nuevamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingFlat((prevFlat) => ({
      ...prevFlat,
      [name]: value,
    }));
  };

  const handleDeleteFlat = async (flatId) => {
    try {
      // Eliminar el documento en Firestore
      await deleteDoc(doc(db, "flats", flatId));

      // Actualizar la lista de flats en el estado
      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
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
    <div>
      <h2>Mis Propiedades</h2>
      {flats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Área (m²)</th>
              <th>Aire Acondicionado</th>
              <th>Año de Construcción</th>
              <th>Precio de Renta</th>
              <th>Fecha Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.city}</td>
                <td>{flat.streetname}</td>
                <td>{flat.streetnumber}</td>
                <td>{flat.areasize}</td>
                <td>{flat.hasac ? "Sí" : "No"}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>
                  <button onClick={() => handleEditClick(flat)}>Editar</button>
                  <button onClick={() => handleDeleteFlat(flat.id)}>
                    Eliminar Flat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes flats registrados.</p>
      )}
*/
{
  /* Formulario de Edición */
}
/*
      {editingFlat && (
        <div>
          <h3>Editar Propiedad</h3>
          <form onSubmit={handleUpdateFlat}>
            <label>
              Ciudad:
              <input
                type="text"
                name="city"
                value={editingFlat.city}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Calle:
              <input
                type="text"
                name="streetname"
                value={editingFlat.streetname}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Número:
              <input
                type="number"
                name="streetnumber"
                value={editingFlat.streetnumber}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Área (m²):
              <input
                type="number"
                name="areasize"
                value={editingFlat.areasize}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
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
            </label>
            <br />
            <label>
              Año de Construcción:
              <input
                type="number"
                name="yearbuilt"
                value={editingFlat.yearbuilt}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Precio de Renta:
              <input
                type="number"
                name="rentprice"
                value={editingFlat.rentprice}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Fecha Disponible:
              <input
                type="date"
                name="dateavaliable"
                value={editingFlat.dateavaliable}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">Actualizar Flat</button>
            <button type="button" onClick={() => setEditingFlat(null)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MyFlats;
*/
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

function MyFlats() {
  const [flats, setFlats] = useState([]);
  const [editingFlat, setEditingFlat] = useState(null); // Estado para el flat en edición
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensaje de éxito

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener los flats del usuario
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
    setEditingFlat(flat); // Establecer el flat que se está editando
  };

  const handleUpdateFlat = async (e) => {
    e.preventDefault();
    if (!editingFlat) return;

    try {
      // Actualizar el documento en Firestore
      const flatRef = doc(db, "flats", editingFlat.id);
      await updateDoc(flatRef, { ...editingFlat });

      // Actualizar la lista de flats en el estado
      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat.id === editingFlat.id ? { ...editingFlat } : flat
        )
      );

      setEditingFlat(null); // Limpiar el estado de edición
      setSuccessMessage("Flat actualizado."); // Mensaje de éxito
      setTimeout(() => setSuccessMessage(""), 3000); // Limpiar mensaje de éxito después de 3 segundos
    } catch (err) {
      console.error("Error al actualizar el flat: ", err);
      setError("Error al actualizar el flat. Por favor, intenta nuevamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingFlat((prevFlat) => ({
      ...prevFlat,
      [name]: value,
    }));
  };

  const handleDeleteFlat = async (flatId) => {
    try {
      // Eliminar el documento en Firestore
      await deleteDoc(doc(db, "flats", flatId));

      // Actualizar la lista de flats en el estado
      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
      setSuccessMessage("Flat eliminado."); // Mensaje de éxito
      setTimeout(() => setSuccessMessage(""), 3000); // Limpiar mensaje de éxito después de 3 segundos
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
    <div>
      <h2>Mis Propiedades</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {flats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Área (m²)</th>
              <th>Aire Acondicionado</th>
              <th>Año de Construcción</th>
              <th>Precio de Renta</th>
              <th>Fecha Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.city}</td>
                <td>{flat.streetname}</td>
                <td>{flat.streetnumber}</td>
                <td>{flat.areasize}</td>
                <td>{flat.hasac ? "Sí" : "No"}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>
                  <button onClick={() => handleEditClick(flat)}>Editar</button>
                  <button onClick={() => handleDeleteFlat(flat.id)}>
                    Eliminar Flat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes flats registrados.</p>
      )}

      {/* Formulario de Edición */}
      {editingFlat && (
        <div>
          <h3>Editar Propiedad</h3>
          <form onSubmit={handleUpdateFlat}>
            <label>
              Ciudad:
              <input
                type="text"
                name="city"
                value={editingFlat.city}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Calle:
              <input
                type="text"
                name="streetname"
                value={editingFlat.streetname}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Número:
              <input
                type="number"
                name="streetnumber"
                value={editingFlat.streetnumber}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Área (m²):
              <input
                type="number"
                name="areasize"
                value={editingFlat.areasize}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
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
            </label>
            <br />
            <label>
              Año de Construcción:
              <input
                type="number"
                name="yearbuilt"
                value={editingFlat.yearbuilt}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Precio de Renta:
              <input
                type="number"
                name="rentprice"
                value={editingFlat.rentprice}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Fecha Disponible:
              <input
                type="date"
                name="dateavaliable"
                value={editingFlat.dateavaliable}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">Actualizar Flat</button>
            <button type="button" onClick={() => setEditingFlat(null)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MyFlats;
