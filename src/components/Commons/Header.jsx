import styled from "styled-components";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/Logotipo.svg";
import AuthContext from "../../context/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const HeaderContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #001f3d;
  color: #f3f3f1;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  width: 99%;
  height: 100px;
  position: absolute;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    position: static;
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
  color: #f3f3f1;
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
  color: #f3f3f1;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // Limpia el contexto de autenticación
    navigate("/login"); // Redirige al login
  };

  return (
    <HeaderContainer>
      <Logo src={LogoImage} alt="Tu Logotipo" />

      <NavLinks>
        <NavLink to="/FlatsList">All Flats</NavLink>
        <NavLink to="/MyFlats">My Flats</NavLink>
        <NavLink to="/NewFlatPage">New Flat</NavLink>
        <NavLink to="/MyProfile">My Profile</NavLink>
        <NavLink to="/Messages">Messages</NavLink>

        {auth.isAdmin && <NavLink to="/Edit-Users">Edit Users</NavLink>}
        {auth.firstname && (
          <UserSection>
            <span
              style={{
                marginRight: "10px",
                color: "#f3f3f1",
                fontSize: "25px",
              }}
            >
              Hello, {auth.firstname}
            </span>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </UserSection>
        )}
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;
