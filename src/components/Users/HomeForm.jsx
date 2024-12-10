import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import logo from "../../assets/Logotipo.svg"; // Replace with your actual logo path
import RegisterForm from "./RegisterForm";

const Home = () => {
  // Estilos en línea

  // link imagen: https://i.pinimg.com/originals/07/70/8c/07708ca10b8295d65485352561202dcf.jpg

  const divStyle = {
    backgroundImage:
      'url("https://i.pinimg.com/originals/07/70/8c/07708ca10b8295d65485352561202dcf.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const h1Style = {
    fontSize: "3rem",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    margin: 0,
  };

  const sloganStyle = {
    fontSize: "1.5rem",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    marginTop: "25rem",
  };

  return (
    <>
      <div style={divStyle}>
        <h1 style={h1Style}>Bienvenido a FlatFinder</h1>

        <h2 style={sloganStyle}>
          Tu nuevo hogar, más cerca de lo que imaginas
        </h2>
      </div>
    </>
  );
};
export default Home;
