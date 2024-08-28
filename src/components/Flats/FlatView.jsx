//Componente para ver los detalles del flat
/*
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase"; // Ajusta la ruta según tu estructura de carpetas

function MyFlats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [storedUser]);

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
*/
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

function MyFlats() {
  const [flats, setFlats] = useState([]);
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

        // Consulta para obtener los flats del usuario con el campo favorite/*
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

  // Función para manejar el cambio de estado de favorito
  const handleFavoriteToggle = async (flatId, currentFavorite) => {
    try {
      const flatDocRef = doc(db, "flats", flatId);

      // Actualizar el campo 'favorite' en el documento del flat
      await updateDoc(flatDocRef, { favorite: !currentFavorite });

      // Actualizar el estado local de flats
      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat.id === flatId ? { ...flat, favorite: !currentFavorite } : flat
        )
      );
    } catch (err) {
      console.error("Error al actualizar favoritos: ", err);
      setError("Error al actualizar favoritos. Por favor, intenta nuevamente.");
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
              <th>Favorito</th>
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
                  <button
                    onClick={() => handleFavoriteToggle(flat.id, flat.favorite)}
                  >
                    {flat.favorite
                      ? "Quitar de favoritos"
                      : "Marcar como favorito"}
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
