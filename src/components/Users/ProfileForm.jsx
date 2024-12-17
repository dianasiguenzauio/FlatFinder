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
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (auth.token) {
      const decodedToken = jwtDecode(auth.token);
      setUserId(decodedToken.user_id);
    }
  }, [auth.token]);

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

        const userData = {
          firstname: response.data?.firstname || "",
          lastname: response.data?.lastname || "",
          password: "",
          birthdate: response.data?.birthdate
            ? response.data.birthdate.slice(0, 10)
            : "",
        };

        setFormData(userData);

        // Valida los campos cargados
        Object.entries(userData).forEach(([key, value]) => {
          validateField(key, value);
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

  const validateField = (name, value) => {
    const nameRegex = /^[a-zA-Z]{2,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,])[A-Za-z\d!@#$%^&*.,]{6,}$/;
    const newErrors = { ...errors };

    switch (name) {
      case "firstname":
      case "lastname":
        if (!nameRegex.test(value)) {
          newErrors[name] = "Debe tener entre 2 y 20 caracteres, solo letras.";
        } else {
          delete newErrors[name];
        }
        break;

      case "birthdate":
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        if (age < 18 || age > 120) {
          newErrors[name] = "Debes tener entre 18 y 120 años.";
        } else {
          delete newErrors[name];
        }
        break;

      case "password":
        if (value && !passwordRegex.test(value)) {
          newErrors[name] =
            "Debe tener al menos 6 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.";
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    validateField(name, value); // Validar el campo en tiempo real
  };

  const handleSaveChanges = async () => {
    if (Object.keys(errors).length > 0) {
      setErrorMessage("Por favor, corrige los errores antes de continuar.");
      return;
    }

    try {
      const updatedData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        birthdate: formData.birthdate,
      };

      if (formData.password) {
        updatedData.password = formData.password;
      }

      await axios.patch(
        `http://localhost:8080/users/updateUser/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setSuccessMessage(
        "Datos actualizados correctamente, vuelva a iniciar sesion."
      );
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/Login");
      }, 3000);
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
            error={!!errors.firstname}
            helperText={errors.firstname || ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "2px solid purple", // Aplica el borde morado correctamente
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Borde morado al enfocar
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
            error={!!errors.lastname}
            helperText={errors.lastname || ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "2px solid purple", // Aplica el borde morado correctamente
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Borde morado al enfocar
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
            error={!!errors.birthdate}
            helperText={errors.birthdate || ""}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "2px solid purple", // Aplica el borde morado correctamente
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Borde morado al enfocar
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
            error={!!errors.password}
            helperText={
              errors.password ||
              "Deja este campo vacío si no deseas cambiar la contraseña."
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "2px solid purple", // Aplica el borde morado correctamente
                },
                "&:hover fieldset": {
                  borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "purple", // Borde morado al enfocar
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
              disabled={Object.keys(errors).length > 0} // Deshabilita si hay errores
              sx={{
                backgroundColor: "#179fba",
                "&:hover": {
                  backgroundColor: "#137d94",
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
