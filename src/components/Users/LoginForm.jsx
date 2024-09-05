import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./../././../config/firebase";
// Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import AuthContext from "./.././../context/authContext";
import { useContext } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUserForm = () => {
    navigate("/RegistrerPage");
  };

  const handleLogin = async (e) => {
    const user = { email, password };
    e.preventDefault();
    setError("");

    try {
      // Consulta la colección 'users' donde el campo 'email' coincida con el email ingresado
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("El usuario no existe.");
        return;
      }

      // Verificar si la contraseña coincide
      const userDoc = querySnapshot.docs[0].data();
      if (userDoc.password === password) {
        // Redirige a la página principal o al dashboard después de un login exitoso
        const user = { email, password };
        login(JSON.stringify(user));
        alert("Ingreso exitoso");
        navigate("/");
        console.log(user);
      } else {
        setError("Contraseña incorrecta.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión: ", err);
      setError("Error al iniciar sesión. Por favor, intenta nuevamente.");
    }
  };

  return (
    <Box component="section">
      <Typography variant="h2">Iniciar Sesión</Typography>
      <form onSubmit={handleLogin}>
        <div>
          <Typography variant="body1">Email:</Typography>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Typography variant="body1">Contraseña:</Typography>
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <Typography sx={{ color: "red" }} variant="body2">
            {error}
          </Typography>
        )}
        <div>
          <Button variant="contained" type="submit">
            Ingresar
          </Button>
          <Button variant="outlined" onClick={handleUserForm}>
            Crear cuenta
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default Login;
