//Componente de formulario de login

import React, { useState, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./../././../config/firebase";
import { useNavigate } from "react-router-dom";
import AuthContext from "./.././../context/authContext";
import logo from "../../assets/Logotipo.svg"; // Replace with your actual logo path

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
    e.preventDefault();
    setError("");

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("El usuario no existe.");
        return;
      }

      const userDoc = querySnapshot.docs[0].data();
      if (userDoc.password === password) {
        const user = { email, password };
        login(JSON.stringify(user));
        alert("Ingreso exitoso");

        const flatsCollection = collection(db, "flats");
        const flatsSnapshot = await getDocs(flatsCollection);

        const updatePromises = flatsSnapshot.docs.map((flatDoc) => {
          const flatRef = doc(db, "flats", flatDoc.id);
          return updateDoc(flatRef, { favorite: false });
        });

        await Promise.all(updatePromises);

        navigate("/");
      } else {
        setError("Contraseña incorrecta.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión: ", err);
      setError("Error al iniciar sesión. Por favor, intenta nuevamente.");
    }
  };

  // Estilos en línea
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f0f0",
      padding: "20px",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
    },
    inputField: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    button: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      backgroundColor: "#6aa9bb",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    secondaryButton: {
      backgroundColor: "#5e17a9",
    },
    errorText: {
      color: "red",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <img
          src={logo}
          alt="Company Logo"
          style={{ width: "100px", margin: "10px 0" }}
        />
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.inputField}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.inputField}
            />
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.button}>
            Ingresar
          </button>
          <button
            type="button"
            onClick={handleUserForm}
            style={{ ...styles.button, ...styles.secondaryButton }}
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
