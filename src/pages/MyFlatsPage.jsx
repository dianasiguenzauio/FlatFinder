//Pagina para ver el listado de flats del usuario

import React from "react";
import ViewFlat from "../components/Flats/FlatList";

const MyFlatsPage = () => {
  // Contenido del componente
  return (
    <>
      <div>
        <h1>MyFlatsPage</h1>
      </div>
      <ViewFlat> view </ViewFlat>
    </>
  );
};

export default MyFlatsPage;
