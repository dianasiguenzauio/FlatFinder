import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AuthContext, { AuthProvider } from "../../context/authContext";
import LogoImage from "../../assets/Logotipo.svg";
/*
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #000000;
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 999;
`;

const Logo = styled.img`
  width: 150px;
  justify-content: flex-start;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #dfdfdf;
  margin: 0 1rem;
  font-weight: bold;
  &:hover {
    color: #ffffff;
  }
`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user);

  return (
    <>
      <NavbarContainer>
        <Logo src={LogoImage} alt="Tu Logotipo" />
        {user && <h2>{user.firstname}</h2>}
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/NewFlatPage">Nuevo Flat</NavLink>
        <NavLink to="/FavouritesPage">Mis Favoritos</NavLink>
        <NavLink to="/MyFlatsPage">Mis Flats</NavLink>
        <NavLink to="/ProfilePage">Mi Perfil</NavLink>
        <NavLink to="/MessagePage">Mensajes</NavLink>
        <NavLink to="/login" onClick={logout}>
          {" "}
          Cerrar Sesión{" "}
        </NavLink>
      </NavbarContainer>
    </>
  );
};

export default Navbar;
*/
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #1e1e1e;
  color: #b6d5bf;
  padding: 1rem;
  display: flex;
  justify-content: space-between; /* Alinea el logo a la izquierda y el resto de los items a la derecha */
  align-items: center;
  z-index: 999;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem 0; /* Más espacio en pantallas pequeñas */
  }
`;

const Logo = styled.img`
  width: 150px;

  @media (max-width: 768px) {
    width: 120px; /* Reducir tamaño en pantallas pequeñas */
    margin-bottom: 1rem; /* Añadir espacio debajo del logo en pantallas pequeñas */
  }
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%; /* Centra y expande los enlaces en pantallas pequeñas */
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #b6d5bf;
  margin: 0 1rem;
  font-weight: bold;

  &:hover {
    color: #089595;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0; /* Reducir márgenes en pantallas pequeñas */
  }
`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <NavbarContainer>
        <Logo src={LogoImage} alt="Tu Logotipo" />
        {user && <h3>👤{user.firstname}</h3>}
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
    </>
  );
};

export default Navbar;
