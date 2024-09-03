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
/*
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

export default UserProfile;*/
//validaciones
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
  const [fieldErrors, setFieldErrors] = useState({
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
        setEditData({ ...userDoc }); // Inicializamos editData con los datos del usuario
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
  }, []); // Eliminar 'storedUser' de las dependencias para que solo se ejecute una vez al montarse el componente

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    const nameRegex = /^[A-Za-z]*$/; // Solo letras
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Contraseña con al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial

    if (name === "firstname" || name === "lastname") {
      if (!nameRegex.test(value)) {
        errorMsg = "El campo solo debe contener letras.";
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        errorMsg =
          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.";
      }
    }

    if (name === "birthdate") {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        errorMsg = "Debes tener al menos 18 años.";
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return; // Si la validación falla, no continuar
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
      alert("Datos actualizados con éxito.");
    } catch (err) {
      console.error("Error al actualizar los datos del usuario: ", err);
      setError(
        "Error al actualizar los datos del usuario. Por favor, intenta nuevamente."
      );
    }
  };

  const validateForm = () => {
    // Recorremos cada campo para validar que no haya errores
    for (let key in editData) {
      if (editData.hasOwnProperty(key)) {
        validateField(key, editData[key]);
        if (fieldErrors[key]) {
          return false;
        }
      }
    }
    return true;
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
            {fieldErrors.firstname && (
              <p style={{ color: "red" }}>{fieldErrors.firstname}</p>
            )}
          </div>
          <div>
            <label>Apellido:</label>
            <input
              type="text"
              name="lastname"
              value={editData.lastname}
              onChange={handleInputChange}
            />
            {fieldErrors.lastname && (
              <p style={{ color: "red" }}>{fieldErrors.lastname}</p>
            )}
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={editData.password}
              onChange={handleInputChange}
            />
            {fieldErrors.password && (
              <p style={{ color: "red" }}>{fieldErrors.password}</p>
            )}
          </div>
          <div>
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="birthdate"
              value={editData.birthdate}
              onChange={handleInputChange}
            />
            {fieldErrors.birthdate && (
              <p style={{ color: "red" }}>{fieldErrors.birthdate}</p>
            )}
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
