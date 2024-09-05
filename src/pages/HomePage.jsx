import React, { useEffect, useState } from "react";
import NavbarContainer from "../components/Commons/Navbar";
import FlatList from "../components/Flats/FlatList";
import { getFlats } from "../services/firebase";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

function HomePage() {
  const [flats, setFlats] = useState([]);
  const [initialFlats, setInitialFlats] = useState([]); // Store initial fetched flats

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
    setInitialFlats(flats); // Store initial data for reset
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const filteredFlats = initialFlats.filter((flat) => {
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

  const handleClearSearch = () => {
    setSearchQuery({ city: "", areasize: "", minPrice: "" }); // Reset search state
    setFlats(initialFlats); // Reset flats to initial data
  };

  return (
    <>
      <div>
        <NavbarContainer />
        <h1>HomePage</h1>
        <form onSubmit={handleSearchSubmit}>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                label="Ciudad"
                id="outlined-size-small"
                value={searchQuery.city}
                onChange={handleInputChange}
              />

              <TextField
                label="Área mayor a"
                type="number"
                id="filled-size-small"
                value={searchQuery.areasize}
                onChange={handleInputChange}
              />

              <TextField
                label="Precio mayor a"
                type="number"
                id="standard-size-small"
                value={searchQuery.minPrice}
                onChange={handleInputChange}
              />
              <button type="submit" variant="contained">
                Buscar
              </button>
              <button
                type="button"
                variant="outlined"
                onClick={handleClearSearch}
              >
                Borrar Búsqueda
              </button>
            </div>
          </Box>
        </form>
      </div>
      <FlatList flats={flats} />
    </>
  );
}

export default HomePage;
