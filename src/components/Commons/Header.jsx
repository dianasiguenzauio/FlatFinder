import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/Logotipo.svg";

// Estilos para el contenedor del navbar
const HeaderContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #1e1e1e;
  color: #b6d5bf;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  max-width: 1400px;

  @media (max-width: 768px) {
    flex-direction: column; /* Cambia a columna en pantallas pequeñas */
    padding: 1rem 0;
  }
`;

// Estilos para el logo
const Logo = styled.img`
  width: 150px;

  @media (max-width: 768px) {
    width: 120px; /* Reducir tamaño en pantallas pequeñas */
    margin-bottom: 1rem; /* Añadir espacio debajo del logo */
  }
`;

// Estilos para los enlaces del navbar
const NavLinks = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center; /* Centra los enlaces en pantallas pequeñas */
  }
`;

// Estilos individuales de cada enlace
const NavLink = styled(Link)`
  text-decoration: none;
  color: #b6d5bf;
  margin: 0 1rem;
  font-weight: bold;

  &:hover {
    color: #089595;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0; /* Espacio reducido entre enlaces en pantallas pequeñas */
  }
`;

// Estilos para el nombre del usuario
const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem; /* Ajusta el espacio entre el nombre del usuario y los enlaces */
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo src={LogoImage} alt="Tu Logotipo" />

      <NavLinks>
        <NavLink to="/My-Flats">My Flats</NavLink>
        <NavLink to="/New-Flat">New Flat</NavLink>
        <NavLink to="/Messages">Messages</NavLink>
        <NavLink to="/Edit-User">Edit User</NavLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;
