//Componente de formulario de login
// src/components/Login.js

import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./../././../config/firebase"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import AuthContext from "./.././../context/authContext";
import { useContext } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
