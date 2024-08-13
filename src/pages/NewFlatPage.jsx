//Pagina para crear un nuevo flat
//import { useEffect, useRef, useState } from "react";
//import { createFlats, getFlats } from "../services/firebase";
//import { useNavigate } from "react-router-dom";
import React from "react";
import NewFlat from "../components/Flats/FlatForm";

const NewFlatPage = () => {
  // Contenido del componente
  return (
    <>
      <div>
        <h1>NewFlatPage</h1>
      </div>
      <NewFlat> Cmponente New Flat!!</NewFlat>
    </>
  );
};

export default NewFlatPage;
