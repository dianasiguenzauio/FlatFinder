import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import jwtDecode from "jwt-decode";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";

const EditProfile = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    birthdate: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);

  // Decodificar el token para obtener el _id del usuario
  useEffect(() => {
    if (auth.token) {
      const decodedToken = jwtDecode(auth.token);
      setUserId(decodedToken.user_id);
    }
  }, [auth.token]);

  // Obtener los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;
        const response = await axios.get(
          `http://localhost:8080/users/getUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          password: "",
          birthdate: response.data.birthdate.slice(0, 10),
        });
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Error al cargar los datos del usuario. Intenta de nuevo."
        );
      }
    };

    fetchUserData();
  }, [userId, auth.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z]{1,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,])[A-Za-z\d!@#$%^&*..,]{8,}$/;

    // Validar firstname
    if (!nameRegex.test(formData.firstname)) {
      setErrorMessage(
        "El nombre debe contener solo letras y tener un máximo de 20 caracteres."
      );
      return false;
    }

    // Validar lastname
    if (!nameRegex.test(formData.lastname)) {
      setErrorMessage(
        "El apellido debe contener solo letras y tener un máximo de 20 caracteres."
      );
      return false;
    }

    // Validar birthdate (mayor de 18 años)
    const birthDate = new Date(formData.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      setErrorMessage(
        "Debes tener al menos 18 años para actualizar tu perfil."
      );
      return false;
    }

    // Validar password (si se ingresa uno nuevo)
    if (formData.password && !passwordRegex.test(formData.password)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una minúscula, un número y un carácter especial (como !@#$%^&*.,)."
      );
      return false;
    }

    setErrorMessage(""); // Borrar mensajes de error si todo está bien
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      await axios.patch(
        `http://localhost:8080/users/updateUser/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSuccessMessage("Datos actualizados correctamente.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al actualizar los datos. Intenta de nuevo."
      );
    }
  };

  const handleCancel = () => {
    navigate("/FlatsList");
  };

  return (
    <Box sx={{ maxWidth: 600, mt: 20, padding: 3 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#001f3d" }}>
          Editar Perfil
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <form>
          <TextField
            label="Nombre"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderWidth: "2px", // Grosor del borde
                  borderColor: "purple", // Color del borde
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Color del borde cuando está enfocado
                },
              },
            }}
          />
          <TextField
            label="Apellido"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderWidth: "2px", // Grosor del borde
                  borderColor: "purple", // Color del borde
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Color del borde cuando está enfocado
                },
              },
            }}
          />
          <TextField
            label="Fecha de Nacimiento"
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderWidth: "2px", // Grosor del borde
                  borderColor: "purple", // Color del borde
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Color del borde cuando está enfocado
                },
              },
            }}
          />
          <TextField
            label="Nueva Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            helperText="Deja este campo vacío si no deseas cambiar la contraseña."
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderWidth: "2px", // Grosor del borde
                  borderColor: "purple", // Color del borde
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Color del borde cuando está enfocado
                },
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              sx={{
                backgroundColor: "#179fba",
                "&:hover": {
                  backgroundColor: "#137d94", // Color ligeramente más oscuro al pasar el mouse
                },
              }}
            >
              Guardar Cambios
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProfile;
