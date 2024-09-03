import React, { useEffect, useState } from "react";
import NavbarContainer from "../components/Commons/Navbar";
import AllFlats from "../components/Flats/FlatList";

function HomePage() {
  /*
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
*/
  // console.log(searchQuery);

  return (
    <>
      <NavbarContainer></NavbarContainer>
      <AllFlats>Flatlist</AllFlats>
    </>
  );
}

export default HomePage;
