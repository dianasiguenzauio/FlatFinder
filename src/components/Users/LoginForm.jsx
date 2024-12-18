import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import AuthContext from "../../context/authContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validación de email y contraseña antes de enviar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (password.length < 1) {
      setErrorMessage("Por favor, ingresa tu contraseña.");
      return;
    }

    try {
      // Llamada al servicio de login
      const response = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });
      const { token, firstname } = response.data;
      const decodedToken = jwt_decode(token);
      login({
        token,
        firstname,
        isAdmin: decodedToken.isAdmin,
      });

      // Manejo del éxito
      if (response.status === 200) {
        setDialogOpen(true); // Mostrar mensaje de bienvenida
        setTimeout(() => {
          setDialogOpen(false);
          navigate("/FlatsList"); // Redirigir a la ruta principal
        }, 2000); // Cerrar el diálogo automáticamente después de 2 segundos
      }
    } catch (error) {
      // Manejo de errores
      setErrorMessage(
        error.response?.data?.message ||
          "Error al iniciar sesión. Inténtalo de nuevo."
      );
    }
  };

  const formStyle = {
    backgroundColor: "#ffffff",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
    textAlign: "center",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    height: window.innerWidth <= 768 ? "100vh" : "auto",
    width: window.innerWidth <= 768 ? "50%" : "100%",
    marginTop: window.innerWidth <= 768 ? "6rem" : "11rem",
    marginBottom: window.innerWidth <= 768 ? "2rem" : "4rem",
  };

  const inputLogin = {
    width: "350px",
    padding: "10px",
    color: "black",
    backgroundColor: "#f3f3f1",
    border: "2px solid #690dab",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0px 4px 8px #00aaff)",
  };

  const buttonLogin = {
    width: "350px",
    padding: "10px",
    color: "white",
    backgroundColor: "#179fba",
    border: "3px solid #004f9e",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0px 4px 8px #00aaff)",
  };

  return (
    <div style={formStyle}>
      <div>
        <Typography
          variant="h3"
          style={{ textAlign: "center", marginTop: "2rem", color: "#001f3d" }}
        >
          Iniciar Sesión
        </Typography>
        <br />
        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              style={inputLogin}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              style={inputLogin}
              required
            />
          </div>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          <button type="submit" style={buttonLogin}>
            Login
          </button>
        </form>
      </div>

      {/* Diálogo de Bienvenida */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Bienvenido</DialogTitle>
        <DialogContent>¡Inicio de sesión exitoso!</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "400px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  field: {
    marginBottom: "15px",
    color: "#001f3d",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default Login;
