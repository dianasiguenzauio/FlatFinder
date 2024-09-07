//Componente para mostrar el perfil o datos del usuario
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
import { db } from "../../config/firebase"; // Importar auth si es necesario
import { useNavigate } from "react-router-dom"; // Para la redirección

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false); // Para habilitar los campos de nueva contraseña
  const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] =
    useState(false); // Para saber si la contraseña actual es correcta
  const navigate = useNavigate(); // Hook para redirigir

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
  }, []); // Se ejecuta una vez cuando el componente se monta

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setNewPassword(value);
      validatePassword("newPassword", value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      validatePassword("confirmPassword", value);
    } else if (name === "currentPassword") {
      setCurrentPassword(value);
      validateCurrentPassword(value); // Verificar contraseña actual en tiempo real
    }
  };

  const validatePassword = (name, value) => {
    let errorMsg = "";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (name === "newPassword") {
      if (!passwordRegex.test(value)) {
        errorMsg =
          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.";
      }
    }

    if (name === "confirmPassword") {
      if (value !== newPassword) {
        errorMsg = "Las contraseñas no coinciden.";
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const validateCurrentPassword = (password) => {
    let errorMsg = "";

    // Verificamos si la contraseña ingresada coincide con la almacenada
    if (password !== userData.password) {
      errorMsg = "La contraseña actual no es correcta.";
      setIsCurrentPasswordCorrect(false);
    } else {
      setIsCurrentPasswordCorrect(true); // Si la contraseña es correcta
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      currentPassword: errorMsg,
    }));
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    const nameRegex = /^[A-Za-z]*$/;

    if (name === "firstname" || name === "lastname") {
      if (!nameRegex.test(value)) {
        errorMsg = "El campo solo debe contener letras.";
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    // Verificar si el usuario ingresó una nueva contraseña
    if (newPassword !== "" && newPassword === confirmPassword) {
      try {
        // Actualizar la contraseña y otros datos en Firestore
        const userDocRef = doc(db, "users", userData.id);
        await updateDoc(userDocRef, {
          password: newPassword,
          firstname: editData.firstname,
          lastname: editData.lastname,
          birthdate: editData.birthdate,
        });

        alert(
          "Datos actualizados con éxito. Por favor, inicia sesión nuevamente."
        );
        navigate("/login"); // Redirige a la página de inicio
      } catch (error) {
        setError("Error al actualizar los datos.");
      }
    } else {
      try {
        // Actualizar solo los datos personales
        const userDocRef = doc(db, "users", userData.id);
        await updateDoc(userDocRef, {
          firstname: editData.firstname,
          lastname: editData.lastname,
          birthdate: editData.birthdate,
        });

        alert(
          "Datos actualizados con éxito. Por favor, inicia sesión nuevamente."
        );
        navigate("/login"); // Redirige a la página de login
      } catch (error) {
        setError("Error al actualizar los datos.");
      }
    }
  };

  const validateForm = () => {
    // Validar los campos editados
    for (let key in editData) {
      if (editData.hasOwnProperty(key)) {
        validateField(key, editData[key]);
        if (fieldErrors[key]) {
          return false;
        }
      }
    }

    // Validar las contraseñas si el usuario desea cambiarlas
    if (
      isPasswordChangeEnabled &&
      (fieldErrors.newPassword || fieldErrors.confirmPassword)
    ) {
      return false;
    }

    return true;
  };

  const togglePasswordChange = () => {
    setIsPasswordChangeEnabled(!isPasswordChangeEnabled);
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

          <div>
            <label>
              <input
                type="checkbox"
                checked={isPasswordChangeEnabled}
                onChange={togglePasswordChange}
              />
              Cambiar contraseña
            </label>
          </div>

          {isPasswordChangeEnabled && (
            <>
              <div>
                <label>Contraseña Actual:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                />
                {fieldErrors.currentPassword && (
                  <p style={{ color: "red" }}>{fieldErrors.currentPassword}</p>
                )}
              </div>

              {isCurrentPasswordCorrect && (
                <>
                  <div>
                    <label>Nueva Contraseña:</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                    />
                    {fieldErrors.newPassword && (
                      <p style={{ color: "red" }}>{fieldErrors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label>Confirmar Nueva Contraseña:</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {fieldErrors.confirmPassword && (
                      <p style={{ color: "red" }}>
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

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
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);
  const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] =
    useState(false);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

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

        const userDoc = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;

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
    validateField(name, value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setNewPassword(value);
      validatePassword("newPassword", value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      validatePassword("confirmPassword", value);
    } else if (name === "currentPassword") {
      setCurrentPassword(value);
      validateCurrentPassword(value);
    }
  };

  const validatePassword = (name, value) => {
    let errorMsg = "";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (name === "newPassword") {
      if (!passwordRegex.test(value)) {
        errorMsg =
          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.";
      }
    }

    if (name === "confirmPassword") {
      if (value !== newPassword) {
        errorMsg = "Las contraseñas no coinciden.";
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const validateCurrentPassword = (password) => {
    let errorMsg = "";

    if (password !== userData.password) {
      errorMsg = "La contraseña actual no es correcta.";
      setIsCurrentPasswordCorrect(false);
    } else {
      setIsCurrentPasswordCorrect(true);
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      currentPassword: errorMsg,
    }));
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    const nameRegex = /^[A-Za-z]*$/;

    if (name === "firstname" || name === "lastname") {
      if (!nameRegex.test(value)) {
        errorMsg = "El campo solo debe contener letras.";
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    if (newPassword !== "" && newPassword === confirmPassword) {
      try {
        const userDocRef = doc(db, "users", userData.id);
        await updateDoc(userDocRef, {
          password: newPassword,
          firstname: editData.firstname,
          lastname: editData.lastname,
          birthdate: editData.birthdate,
        });

        alert(
          "Datos actualizados con éxito. Por favor, inicia sesión nuevamente."
        );
        navigate("/login");
      } catch (error) {
        setError("Error al actualizar los datos.");
      }
    } else {
      try {
        const userDocRef = doc(db, "users", userData.id);
        await updateDoc(userDocRef, {
          firstname: editData.firstname,
          lastname: editData.lastname,
          birthdate: editData.birthdate,
        });

        alert(
          "Datos actualizados con éxito. Por favor, inicia sesión nuevamente."
        );
        navigate("/login");
      } catch (error) {
        setError("Error al actualizar los datos.");
      }
    }
  };

  const validateForm = () => {
    for (let key in editData) {
      if (editData.hasOwnProperty(key)) {
        validateField(key, editData[key]);
        if (fieldErrors[key]) {
          return false;
        }
      }
    }

    if (
      isPasswordChangeEnabled &&
      (fieldErrors.newPassword || fieldErrors.confirmPassword)
    ) {
      return false;
    }

    return true;
  };

  const togglePasswordChange = () => {
    setIsPasswordChangeEnabled(!isPasswordChangeEnabled);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>Perfil de Usuario</h2>
      {userData ? (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Email:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="email"
              value={userData.email}
              disabled
            />
          </div>
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Nombre:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="text"
              name="firstname"
              value={editData.firstname}
              onChange={handleInputChange}
            />
            {fieldErrors.firstname && (
              <p style={{ color: "red" }}>{fieldErrors.firstname}</p>
            )}
          </div>
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Apellido:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="text"
              name="lastname"
              value={editData.lastname}
              onChange={handleInputChange}
            />
            {fieldErrors.lastname && (
              <p style={{ color: "red" }}>{fieldErrors.lastname}</p>
            )}
          </div>
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Fecha de Nacimiento:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="date"
              name="birthdate"
              value={editData.birthdate}
              onChange={handleInputChange}
            />
            {fieldErrors.birthdate && (
              <p style={{ color: "red" }}>{fieldErrors.birthdate}</p>
            )}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={isPasswordChangeEnabled}
                onChange={togglePasswordChange}
              />
              Cambiar contraseña
            </label>
          </div>

          {isPasswordChangeEnabled && (
            <>
              <div style={{ marginBottom: "10px", width: "100%" }}>
                <label>Contraseña Actual:</label>
                <input
                  style={{ width: "100%", padding: "8px" }}
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                />
                {fieldErrors.currentPassword && (
                  <p style={{ color: "red" }}>{fieldErrors.currentPassword}</p>
                )}
              </div>

              {isCurrentPasswordCorrect && (
                <>
                  <div style={{ marginBottom: "10px", width: "100%" }}>
                    <label>Nueva Contraseña:</label>
                    <input
                      style={{ width: "100%", padding: "8px" }}
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                    />
                    {fieldErrors.newPassword && (
                      <p style={{ color: "red" }}>{fieldErrors.newPassword}</p>
                    )}
                  </div>
                  <div style={{ marginBottom: "10px", width: "100%" }}>
                    <label>Confirmar Nueva Contraseña:</label>
                    <input
                      style={{ width: "100%", padding: "8px" }}
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {fieldErrors.confirmPassword && (
                      <p style={{ color: "red" }}>
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <button
            type="button"
            onClick={handleUpdate}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
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
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);
  const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] =
    useState(false);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

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

        const userDoc = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;

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
    validateField(name, value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setNewPassword(value);
      validatePassword("newPassword", value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      validatePassword("confirmPassword", value);
    } else if (name === "currentPassword") {
      setCurrentPassword(value);
      validateCurrentPassword(value);
    }
  };

  const validatePassword = (name, value) => {
    let errorMsg = "";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (name === "newPassword") {
      if (!passwordRegex.test(value)) {
        errorMsg =
          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.";
      }
    }

    if (name === "confirmPassword") {
      if (value !== newPassword) {
        errorMsg = "Las contraseñas no coinciden.";
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const validateCurrentPassword = (password) => {
    let errorMsg = "";

    if (password !== userData.password) {
      errorMsg = "La contraseña actual no es correcta.";
      setIsCurrentPasswordCorrect(false);
    } else {
      setIsCurrentPasswordCorrect(true);
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      currentPassword: errorMsg,
    }));
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    const nameRegex = /^[A-Za-z]*$/;

    if (name === "firstname" || name === "lastname") {
      if (!nameRegex.test(value)) {
        errorMsg = "El campo solo debe contener letras.";
      }
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    if (newPassword !== "" && newPassword === confirmPassword) {
      try {
        const userDocRef = doc(db, "users", userData.id);
        await updateDoc(userDocRef, {
          password: newPassword,
          firstname: editData.firstname,
          lastname: editData.lastname,
          birthdate: editData.birthdate,
        });

        alert(
          "Datos actualizados con éxito. Por favor, inicia sesión nuevamente."
        );
        navigate("/login");
      } catch (error) {
        setError("Error al actualizar los datos.");
      }
    } else {
      try {
        const userDocRef = doc(db, "users", userData.id);
        await updateDoc(userDocRef, {
          firstname: editData.firstname,
          lastname: editData.lastname,
          birthdate: editData.birthdate,
        });

        alert(
          "Datos actualizados con éxito. Por favor, inicia sesión nuevamente."
        );
        navigate("/login");
      } catch (error) {
        setError("Error al actualizar los datos.");
      }
    }
  };

  const validateForm = () => {
    for (let key in editData) {
      if (editData.hasOwnProperty(key)) {
        validateField(key, editData[key]);
        if (fieldErrors[key]) {
          return false;
        }
      }
    }

    if (
      isPasswordChangeEnabled &&
      (fieldErrors.newPassword || fieldErrors.confirmPassword)
    ) {
      return false;
    }

    return true;
  };

  const togglePasswordChange = () => {
    setIsPasswordChangeEnabled(!isPasswordChangeEnabled);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // minHeight: "100vh",
        //flexDirection: "column",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      <h2>Perfil de Usuario</h2>
      {userData ? (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Email:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="email"
              value={userData.email}
              disabled
            />
          </div>
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Nombre:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="text"
              name="firstname"
              value={editData.firstname}
              onChange={handleInputChange}
            />
            {fieldErrors.firstname && (
              <p style={{ color: "red" }}>{fieldErrors.firstname}</p>
            )}
          </div>
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Apellido:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="text"
              name="lastname"
              value={editData.lastname}
              onChange={handleInputChange}
            />
            {fieldErrors.lastname && (
              <p style={{ color: "red" }}>{fieldErrors.lastname}</p>
            )}
          </div>
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <label>Fecha de Nacimiento:</label>
            <input
              style={{ width: "100%", padding: "8px" }}
              type="date"
              name="birthdate"
              value={editData.birthdate}
              onChange={handleInputChange}
            />
            {fieldErrors.birthdate && (
              <p style={{ color: "red" }}>{fieldErrors.birthdate}</p>
            )}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={isPasswordChangeEnabled}
                onChange={togglePasswordChange}
              />
              Cambiar contraseña
            </label>
          </div>

          {isPasswordChangeEnabled && (
            <>
              <div style={{ marginBottom: "10px", width: "100%" }}>
                <label>Contraseña Actual:</label>
                <input
                  style={{ width: "100%", padding: "8px" }}
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                />
                {fieldErrors.currentPassword && (
                  <p style={{ color: "red" }}>{fieldErrors.currentPassword}</p>
                )}
              </div>

              {isCurrentPasswordCorrect && (
                <>
                  <div style={{ marginBottom: "10px", width: "100%" }}>
                    <label>Nueva Contraseña:</label>
                    <input
                      style={{ width: "100%", padding: "8px" }}
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                    />
                    {fieldErrors.newPassword && (
                      <p style={{ color: "red" }}>{fieldErrors.newPassword}</p>
                    )}
                  </div>
                  <div style={{ marginBottom: "10px", width: "100%" }}>
                    <label>Confirmar Nueva Contraseña:</label>
                    <input
                      style={{ width: "100%", padding: "8px" }}
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {fieldErrors.confirmPassword && (
                      <p style={{ color: "red" }}>
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <button
            type="button"
            onClick={handleUpdate}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
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
