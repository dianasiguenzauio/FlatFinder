import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import LogoImage from "../../assets/Logotipo.svg";

// Estilos para el contenedor del navbar
const NavbarContainer = styled.nav`
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

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <NavbarContainer>
      <Logo src={LogoImage} alt="Tu Logotipo" />
      {user && (
        <UserSection>
          <h3>👤{user.firstname}</h3>
        </UserSection>
      )}
      <NavLinks>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/NewFlatPage">Nuevo Flat</NavLink>
        <NavLink to="/FavouritesPage">Mis Favoritos</NavLink>
        <NavLink to="/MyFlatsPage">Mis Flats</NavLink>
        <NavLink to="/ProfilePage">Mi Perfil</NavLink>
        <NavLink to="/MessagePage">Mensajes</NavLink>
        <NavLink to="/login" onClick={logout}>
          Cerrar Sesión
        </NavLink>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
