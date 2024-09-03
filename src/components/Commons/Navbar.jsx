import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AuthContext, { AuthProvider } from "../../context/authContext";
import LogoImage from "../../assets/Logotipo.svg";

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
        <Logo src={LogoImage} alt="Tu Logotipo" /> {/*logotipo */}
        {user && <h2>{user.firstname}</h2>} {/* Mostrar el firstname */}
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/NewFlatPage">Nuevo Flat</NavLink>
        <NavLink to="/FavouritesPage">Mis Favoritos</NavLink>
        <NavLink to="/MyFlatsPage">Mis Flats</NavLink>
        <NavLink to="/ProfilePage">Mi Perfil</NavLink>
        <NavLink to="/login" onClick={logout}>
          {" "}
          Cerrar Sesión{" "}
        </NavLink>
      </NavbarContainer>
    </>
  );
};

export default Navbar;
