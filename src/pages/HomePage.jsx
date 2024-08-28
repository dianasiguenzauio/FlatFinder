//Pagina principal donde vamos a mostrar los flats
import React from "react";
import NavbarContainer from "../components/Commons/Navbar";
import AllFlats from "../components/Flats/FlatList";

function HomePage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>HomePage</h1>
      </div>
      <AllFlats>Flatlist</AllFlats>
    </>
  );
}

export default HomePage;
