import React, { useEffect, useState } from "react";
import NavbarContainer from "../components/Commons/Navbar";
import AllFlats from "../components/Flats/FlatList";

function HomePage() {
  return (
    <>
      <NavbarContainer></NavbarContainer>
      <AllFlats>Flatlist</AllFlats>
    </>
  );
}

export default HomePage;
