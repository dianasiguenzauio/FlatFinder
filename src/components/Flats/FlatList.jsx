//Componente para listar los flats

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

function AllFlats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para filtros
  const [searchQuery, setSearchQuery] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    sortBy: "", // Para ordenar por ciudad, precio, o tamaño de área
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

  // Función para aplicar los filtros y ordenación
  const applyFiltersAndSort = () => {
    let filteredFlats = flats;

    // Filtrar por ciudad
    if (searchQuery.city) {
      filteredFlats = filteredFlats.filter((flat) =>
        flat.city.toLowerCase().includes(searchQuery.city.toLowerCase())
      );
    }

    // Filtrar por rango de precio
    if (searchQuery.minPrice) {
      filteredFlats = filteredFlats.filter(
        (flat) => flat.rentprice >= parseFloat(searchQuery.minPrice)
      );
    }

    if (searchQuery.maxPrice) {
      filteredFlats = filteredFlats.filter(
        (flat) => flat.rentprice <= parseFloat(searchQuery.maxPrice)
      );
    }

    // Filtrar por rango de tamaño de área
    if (searchQuery.minArea) {
      filteredFlats = filteredFlats.filter(
        (flat) => flat.areasize >= parseFloat(searchQuery.minArea)
      );
    }

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

  const filteredFlats = applyFiltersAndSort();

  // Función para manejar el cambio de estado de favorito
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
      <h2>Todos los Flats</h2>

      {/* Formulario de filtros */}
      <form>
        <div>
          <label>Ciudad:</label>
          <input
            type="text"
            name="city"
            value={searchQuery.city}
            onChange={handleInputChange}
            placeholder="Buscar por ciudad"
          />
        </div>

        <div>
          <label>Rango de precio:</label>
          <input
            type="number"
            name="minPrice"
            value={searchQuery.minPrice}
            onChange={handleInputChange}
            placeholder="Precio mínimo"
          />
          <input
            type="number"
            name="maxPrice"
            value={searchQuery.maxPrice}
            onChange={handleInputChange}
            placeholder="Precio máximo"
          />
        </div>

        <div>
          <label>Rango de área (m²):</label>
          <input
            type="number"
            name="minArea"
            value={searchQuery.minArea}
            onChange={handleInputChange}
            placeholder="Tamaño mínimo"
          />
          <input
            type="number"
            name="maxArea"
            value={searchQuery.maxArea}
            onChange={handleInputChange}
            placeholder="Tamaño máximo"
          />
        </div>

        <div>
          <label>Ordenar por:</label>
          <select
            name="sortBy"
            value={searchQuery.sortBy}
            onChange={handleInputChange}
          >
            <option value="">Seleccione</option>
            <option value="city">Ciudad</option>
            <option value="price">Precio</option>
            <option value="areasize">Tamaño de área</option>
          </select>
        </div>
      </form>

      {filteredFlats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Área (m²)</th>
              <th>Año de Construcción</th>
              <th>Precio de Renta</th>
              <th>Fecha Disponible</th>
              <th>Usuario Propietario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.city}</td>
                <td>{flat.streetname}</td>
                <td>{flat.streetnumber}</td>
                <td>{flat.areasize}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>{flat.userEmail}</td>
                <td>
                  <button onClick={() => handleFavoriteToggle(flat)}>
                    {flat.favorite
                      ? "Quitar de favoritos"
                      : "Marcar como favorito"}
                  </button>
                  <button onClick={() => handleViewDetails(flat.id)}>
                    Ver Flat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay flats disponibles.</p>
      )}
    </div>
  );
}

export default AllFlats;
