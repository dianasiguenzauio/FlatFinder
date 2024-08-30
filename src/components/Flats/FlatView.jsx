//Componente para ver los detalles del flat
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase"; // Ajusta la ruta según tu estructura de carpetas
import { deleteFlat } from "../../services/firebase";

function MyFlats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Eliminar flat
  const handleDeleteFlat = async (flatId) => {
    try {
      await deleteFlat(flatId);
      const updatedFlats = flats.filter((flat) => flat.id !== flatId);
      setFlats(updatedFlats);
      alert("¿Estás seguro que quieres eliminar el flat?");
    } catch (error) {
      console.error("Error al eliminar la propiedad: ", error);
      alert("Error al eliminar la propiedad. Inténtalo nuevamente.");
    }
  };

  // Recuperar el usuario del localStorage
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
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.city}</td>
                <td>{flat.streetname}</td>
                <td>{flat.streetnumber}</td>
                <td>{flat.areasize}</td>
                <td>{flat.hasac ? "Sí" : "No"} </td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>
                  <button onClick={() => handleDeleteFlat(flat.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes flats registrados.</p>
      )}
    </div>
  );
}

export default MyFlats;
