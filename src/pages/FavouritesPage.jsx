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
import styled from "styled-components";

// Estilos para el contenedor de flats favoritos centrado
const FlatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
  padding-top: 2%;
  max-width: 1300px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    padding: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 5px;
  }
`;

const FlatCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FlatTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const FlatDetails = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 5px 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ActionButton = styled.button`
  background-color: #6aa9bb;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6aa9bb;
  }
`;

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
      <NavbarContainer />

      <FlatsContainer>
        {flats.length > 0 ? (
          flats.map((flat) => (
            <FlatCard key={flat.id}>
              <FlatTitle>{flat.city}</FlatTitle>
              <FlatDetails>Calle: {flat.streetname}</FlatDetails>
              <FlatDetails>Número: {flat.streetnumber}</FlatDetails>
              <FlatDetails>Área: {flat.areasize} m²</FlatDetails>
              <FlatDetails>
                Aire Acondicionado: {flat.hasac ? "Sí" : "No"}
              </FlatDetails>
              <FlatDetails>Año de Construcción: {flat.yearbuilt}</FlatDetails>
              <FlatDetails>Precio de Renta: ${flat.rentprice}</FlatDetails>
              <FlatDetails>Disponible desde: {flat.dateavaliable}</FlatDetails>
              <FlatDetails>Propietario: {flat.userEmail}</FlatDetails>
              <ActionButton onClick={() => handleRemoveFavorite(flat.id)}>
                Eliminar de favoritos
              </ActionButton>
            </FlatCard>
          ))
        ) : (
          <p>No tienes flats favoritos.</p>
        )}
      </FlatsContainer>
    </div>
  );
}

export default FlatsFavorites;
