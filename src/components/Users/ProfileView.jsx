//Componente para mostrar el perfil o datos del usuario
/*
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/authContext"; // Assuming you have an AuthContext
import { getUserByEmail, updateUser } from "../../services/firebase"; // Assuming you have an updateUser function
import { Field } from "formik";

const ProfileView = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDb = await getUserByEmail(user.email);
      if (userDb.length > 0) {
        setUserData(userDb[0]);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdateProfile = async (updatedValues) => {
    try {
      // Update specific user fields (excluding email)
      // await updateUser(currentUser.uid, updatedValues);
      alert("Perfil actualizado exitosamente!");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el perfil. Intenta nuevamente.");
    }
  };

  return (
    <div>
      {userData && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateProfile({
              // Update only the desired fields (e.g., name, apellido, edad)
              firstname: userData.firstname,
              lastname: userData.lastname,
              birthday: userData.birthday,
              // Exclude email from update
            });
          }}
        >
          
          {userData.firstname}

          <button type="submit">Guardar cambios</button>
        </form>
      )}
    </div>
  );
};

export default ProfileView;
*/
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    birthdate: "",
  });

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener los datos del usuario
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", storedUser.email)
        );

        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          setError("No se encontraron datos del usuario.");
          setLoading(false);
          return;
        }

        // Asumiendo que el correo electrónico es único, obtenemos el primer documento
        const userDoc = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id; // Obtener el ID del documento

        setUserData({ ...userDoc, id: userId });
        setEditData({ ...userDoc });
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los datos del usuario: ", err);
        setError(
          "Error al cargar los datos del usuario. Por favor, intenta nuevamente."
        );
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (
      !editData.firstname ||
      !editData.lastname ||
      !editData.password ||
      !editData.birthdate
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userData.id);
      await updateDoc(userDocRef, {
        firstname: editData.firstname,
        lastname: editData.lastname,
        password: editData.password,
        birthdate: editData.birthdate,
      });

      setUserData(editData); // Actualiza el estado de `userData` con los datos editados
      setError("");
      alert("Datos actualizados con éxito.");
    } catch (err) {
      console.error("Error al actualizar los datos del usuario: ", err);
      setError(
        "Error al actualizar los datos del usuario. Por favor, intenta nuevamente."
      );
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      {userData ? (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ marginTop: "20px" }}
        >
          <div>
            <label>Email:</label>
            <input type="email" value={userData.email} disabled />
          </div>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="firstname"
              value={editData.firstname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              type="text"
              name="lastname"
              value={editData.lastname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={editData.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="birthdate"
              value={editData.birthdate}
              onChange={handleInputChange}
            />
          </div>
          <button type="button" onClick={handleUpdate}>
            Actualizar Datos
          </button>
        </form>
      ) : (
        <p>No se encontraron datos del usuario.</p>
      )}
    </div>
  );
}

export default UserProfile;
