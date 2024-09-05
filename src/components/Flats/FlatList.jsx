//Componente para listar los flats
import { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

// Estilos
const FlatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  padding-top: 5%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const FlatCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
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
`;

const FlatDetails = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 5px 0;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const FilterContainer = styled.div`
  padding-top: 15%;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const FilterForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const FilterInput = styled.input`
  padding: 10px;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const FilterSelect = styled.select`
  padding: 10px;
  width: 220px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const AllFlats = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    sortBy: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        const flatsCollection = collection(db, "flats");
        const querySnapshot = await getDocs(flatsCollection);

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

  const handleInputChange = (event) => {
    setSearchQuery({
      ...searchQuery,
      [event.target.name]: event.target.value,
    });
  };

  // Función que aplica los filtros
  const applyFilters = () => {
    let filteredFlats = flats;

    // Filtro por ciudad
    if (searchQuery.city) {
      filteredFlats = filteredFlats.filter((flat) =>
        flat.city.toLowerCase().includes(searchQuery.city.toLowerCase())
      );
    }

    // Filtro por precio mínimo
    if (searchQuery.minPrice) {
      filteredFlats = filteredFlats.filter(
        (flat) => flat.rentprice >= parseFloat(searchQuery.minPrice)
      );
    }

    // Filtro por precio máximo
    if (searchQuery.maxPrice) {
      filteredFlats = filteredFlats.filter(
        (flat) => flat.rentprice <= parseFloat(searchQuery.maxPrice)
      );
    }

    // Filtro por tamaño mínimo de área
    if (searchQuery.minArea) {
      filteredFlats = filteredFlats.filter(
        (flat) => flat.areasize >= parseFloat(searchQuery.minArea)
      );
    }

    // Filtro por tamaño máximo de área
    if (searchQuery.maxArea) {
      filteredFlats = filteredFlats.filter(
        (flat) => flat.areasize <= parseFloat(searchQuery.maxArea)
      );
    }

    // Ordenar los flats
    if (searchQuery.sortBy) {
      filteredFlats.sort((a, b) => {
        if (searchQuery.sortBy === "city") {
          return a.city.localeCompare(b.city);
        } else if (searchQuery.sortBy === "price") {
          return a.rentprice - b.rentprice;
        } else if (searchQuery.sortBy === "areasize") {
          return a.areasize - b.areasize;
        }
        return 0;
      });
    }

    return filteredFlats;
  };

  const filteredFlats = applyFilters();

  const handleFavoriteToggle = async (flat) => {
    try {
      const flatDocRef = doc(db, "flats", flat.id);
      const newFavoriteState = !flat.favorite;
      const userFavoriteEmail = newFavoriteState ? storedUser.email : "";

      await updateDoc(flatDocRef, {
        favorite: newFavoriteState,
        userFavorite: userFavoriteEmail,
      });

      setFlats((prevFlats) =>
        prevFlats.map((f) =>
          f.id === flat.id
            ? {
                ...f,
                favorite: newFavoriteState,
                userFavorite: userFavoriteEmail,
              }
            : f
        )
      );
    } catch (err) {
      console.error("Error al actualizar favoritos: ", err);
      setError("Error al actualizar favoritos. Por favor, intenta nuevamente.");
    }
  };

  const handleViewDetails = (flatId) => {
    window.open(`/FlatDetailsPage/${flatId}`, "_blank");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <FilterContainer>
        <h2>Bienvenido a Flatfinder</h2>
        <p>
          {" "}
          Somos el mejor portafolio web dedicado al servicio de arrendamiento de
          propiedades a nivel nacional.{" "}
        </p>
        <h2>Filtrar Flats</h2>
        <FilterForm>
          <FilterInput
            type="text"
            name="city"
            value={searchQuery.city}
            onChange={handleInputChange}
            placeholder="Buscar por ciudad"
          />
          <FilterInput
            type="number"
            name="minPrice"
            value={searchQuery.minPrice}
            onChange={handleInputChange}
            placeholder="Precio mínimo"
          />
          <FilterInput
            type="number"
            name="maxPrice"
            value={searchQuery.maxPrice}
            onChange={handleInputChange}
            placeholder="Precio máximo"
          />
          <FilterInput
            type="number"
            name="minArea"
            value={searchQuery.minArea}
            onChange={handleInputChange}
            placeholder="Tamaño mínimo (m²)"
          />
          <FilterInput
            type="number"
            name="maxArea"
            value={searchQuery.maxArea}
            onChange={handleInputChange}
            placeholder="Tamaño máximo (m²)"
          />
          <FilterSelect
            name="sortBy"
            value={searchQuery.sortBy}
            onChange={handleInputChange}
          >
            <option value="">Ordenar por</option>
            <option value="city">Ciudad</option>
            <option value="price">Precio</option>
            <option value="areasize">Tamaño de área</option>
          </FilterSelect>
        </FilterForm>
      </FilterContainer>

      <FlatsContainer>
        {filteredFlats.length > 0 ? (
          filteredFlats.map((flat) => (
            <FlatCard key={flat.id}>
              <FlatTitle>
                {flat.city} - {flat.streetname} {flat.streetnumber}
              </FlatTitle>
              <FlatDetails>Área: {flat.areasize} m²</FlatDetails>
              <FlatDetails>Precio: ${flat.rentprice}</FlatDetails>
              <FlatDetails>Disponible: {flat.dateavaliable}</FlatDetails>
              <FlatDetails>Propietario: {flat.userEmail}</FlatDetails>
              <ActionButton onClick={() => handleViewDetails(flat.id)}>
                Ver Detalles
              </ActionButton>
              <ActionButton onClick={() => handleFavoriteToggle(flat)}>
                {flat.favorite ? "❤️" : "♡"}
              </ActionButton>
            </FlatCard>
          ))
        ) : (
          <p>No hay flats disponibles.</p>
        )}
      </FlatsContainer>
    </div>
  );
};

export default AllFlats;
