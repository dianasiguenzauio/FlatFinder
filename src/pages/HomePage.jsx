import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import NavbarContainer from "../components/Commons/Navbar";
import Home from "../components/Users/HomeForm";
import Footer from "../components/Commons/Footer";

function HomePage() {
  return (
    <>
      <div>
        <NavbarContainer></NavbarContainer>
        <Home> </Home>
        <Footer></Footer>
      </div>
    </>
  );
}
export default HomePage;
