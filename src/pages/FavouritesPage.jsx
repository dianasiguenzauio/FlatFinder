/*import NavbarContainer from "../components/Commons/Navbar";

function FavouritesPage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>FavouritesPage</h1>
      </div>
    </>
  );
}
export default FavouritesPage;
*/
/*nuevo
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from ".././config/firebase";
import NavbarContainer from "../components/Commons/Navbar";

function FlatsFavorites() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFavoriteFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener los flats favoritos del usuario logueado
        const flatsQuery = query(
          collection(db, "flatsfavoritos"),
          where("favorite", "==", true)
        );

        const querySnapshot = await getDocs(flatsQuery);
        const flatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los flats favoritos: ", err);
        setError(
          "Error al cargar los flats favoritos. Por favor, intenta nuevamente."
        );
        setLoading(false);
      }
    };

    fetchFavoriteFlats();
  }, [storedUser]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <NavbarContainer></NavbarContainer>
      <h2>Flats Favoritos</h2>
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
                <td>{flat.hasac ? "Sí" : "No"}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>{flat.favorite ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes flats favoritos.</p>
      )}
    </div>
  );
}

export default FlatsFavorites;
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
import { db } from "../config/firebase";
import NavbarContainer from "../components/Commons/Navbar";

function FlatsFavorites() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFavoriteFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener los flats favoritos del usuario logueado
        const flatsQuery = query(
          collection(db, "flats"),
          where("favorite", "==", true),
          where("userFavorite", "==", storedUser.email)
        );

        const querySnapshot = await getDocs(flatsQuery);
        const flatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los flats favoritos: ", err);
        setError(
          "Error al cargar los flats favoritos. Por favor, intenta nuevamente."
        );
        setLoading(false);
      }
    };

    fetchFavoriteFlats();
  }, []);

  // Función para eliminar un flat de los favoritos
  const handleRemoveFavorite = async (flatId) => {
    try {
      // Obtener referencia al documento del flat
      const flatDocRef = doc(db, "flats", flatId);

      // Actualizar el campo 'userFavorite' para dejarlo vacío y marcar 'favorite' como false
      await updateDoc(flatDocRef, {
        userFavorite: "",
        favorite: false,
      });

      // Actualizar el estado local para reflejar los cambios
      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
    } catch (err) {
      console.error("Error al eliminar de favoritos: ", err);
      setError(
        "Error al eliminar de favoritos. Por favor, intenta nuevamente."
      );
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
      <NavbarContainer></NavbarContainer>
      <h2>Flats Favoritos</h2>
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
                  <button onClick={() => handleRemoveFavorite(flat.id)}>
                    Eliminar de favoritos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes flats favoritos.</p>
      )}
    </div>
  );
}

export default FlatsFavorites;
