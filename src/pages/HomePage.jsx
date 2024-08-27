import React, { useEffect, useState } from "react";
import NavbarContainer from "../components/Commons/Navbar";
import FlatList from "../components/Flats/FlatList";
import { getFlats } from "../services/firebase";

function HomePage() {
  const [flats, setFlats] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    city: "",
    areasize: "",
    minPrice: "",
  });

  const handleInputChange = (event) => {
    setSearchQuery({
      ...searchQuery,
      [event.target.name]: event.target.value,
    });
  };

  // Función para obtener los datos de Firebase
  const fetchFlats = async () => {
    const flats = await getFlats();
    setFlats(flats);
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const allFlats = await getFlats();
    const filteredFlats = allFlats.filter((flat) => {
      return (
        (!searchQuery.city ||
          flat.city.toLowerCase().includes(searchQuery.city.toLowerCase())) &&
        (!searchQuery.areasize || flat.areasize >= searchQuery.areasize) &&
        (!searchQuery.minPrice || flat.rentprice >= searchQuery.minPrice)
      );
    });
    setFlats(filteredFlats);

    console.log(searchQuery);
  };

  return (
    <>
      <div>
        <NavbarContainer />
        <h1>HomePage</h1>
        <form onSubmit={handleSearchSubmit}>
          <label htmlFor="city">Ciudad:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={searchQuery.city}
            onChange={handleInputChange}
          />

          <label htmlFor="areasize">Area mayor a:</label>
          <input
            type="number"
            id="areasize"
            name="areasize"
            value={searchQuery.areasize}
            onChange={handleInputChange}
          />

          <label htmlFor="minPrice">Precio mayor a:</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={searchQuery.minPrice}
            onChange={handleInputChange}
          />

          <button type="submit">Buscar</button>
        </form>
      </div>
      <FlatList flats={flats} />
    </>
  );
}

export default HomePage;
