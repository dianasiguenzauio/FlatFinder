import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Login from "../components/Users/LoginForm";
import logo from "../assets/Logotipo.svg";
import { Grid } from "@mui/material";

function LoginPage() {
  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "200px",
          marginBottom: "20px",

          display: "block",
        }}
      />
      <Login> </Login>
    </Grid>
  );
}
export default LoginPage;
