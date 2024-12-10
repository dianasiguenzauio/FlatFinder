import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/Logotipo.svg";
import AuthContext from "../../context/authContext";

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
    flex-direction: column;
    padding: 1rem 0;
  }
`;

const Logo = styled.img`
  width: 150px;

  @media (max-width: 768px) {
    width: 120px;
    margin-bottom: 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
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
    margin: 0.5rem 0;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Header = () => {
  const { auth } = useContext(AuthContext);

  return (
    <HeaderContainer>
      <Logo src={LogoImage} alt="Tu Logotipo" />

      <NavLinks>
        <NavLink to="/My-Flats">My Flats</NavLink>
        <NavLink to="/New-Flat">New Flat</NavLink>
        <NavLink to="/Messages">Messages</NavLink>
        <NavLink to="/My-Profile">My Perfil</NavLink>
        {auth.isAdmin && <NavLink to="/Edit-Users">Edit Users</NavLink>}
      </NavLinks>

      {auth.firstname && (
        <UserSection>
          <span>Hello, {auth.firstname}</span>
        </UserSection>
      )}
    </HeaderContainer>
  );
};

export default Header;
