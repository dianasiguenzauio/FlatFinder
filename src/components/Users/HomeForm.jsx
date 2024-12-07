import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import logo from "../../assets/Logotipo.svg"; // Replace with your actual logo path
import RegisterForm from "./RegisterForm";

const Home = () => {
  // Estilos en línea

  return (
    <>
      <div>
        <h1>Bienvenido a FlatFinder</h1>
      </div>
    </>
  );
};
export default Home;
