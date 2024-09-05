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

        // Actualizar todos los flats para que el campo 'favorite' sea false
        const flatsCollection = collection(db, "flats");
        const flatsSnapshot = await getDocs(flatsCollection);

        const updatePromises = flatsSnapshot.docs.map((flatDoc) => {
          const flatRef = doc(db, "flats", flatDoc.id);
          return updateDoc(flatRef, { favorite: false });
        });

        // Esperar a que todas las actualizaciones se completen
        await Promise.all(updatePromises);

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
        <button onClick={handleUserForm}>Crear cuenta</button>
      </form>
    </div>
  );
};

export default Login;
