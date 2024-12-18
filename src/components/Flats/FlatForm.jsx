//Componente para crear flat
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import AuthContext from "../../context/authContext";

const NewFlat = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Contexto de autenticación
  const [formValues, setFormValues] = useState({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAc: false,
    yearBuilt: "",
    rentPrice: "",
    dateAvailable: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const errors = {};
    const textRegex = /^[a-zA-Z]{1,20}$/;
    const alphanumericWithSpacesRegex = /^[a-zA-Z0-9\s]{1,20}$/;
    const alphanumericRegex = /^[a-zA-Z0-9]{1,20}$/;
    const numberRegex = /^\d{1,8}$/;

    if (!formValues.city || !textRegex.test(formValues.city)) {
      errors.city = "Solo letras, máximo 20 caracteres.";
    }

    if (
      !formValues.streetName ||
      !alphanumericWithSpacesRegex.test(formValues.streetName)
    ) {
      errors.streetName = "Solo letras y números, máximo 20 caracteres.";
    }

    if (
      !formValues.streetNumber ||
      !alphanumericWithSpacesRegex.test(formValues.streetNumber)
    ) {
      errors.streetNumber = "Solo letras y números, máximo 20 caracteres.";
    }

    if (!formValues.areaSize || !numberRegex.test(formValues.areaSize)) {
      errors.areaSize = "Solo números, máximo 8 caracteres.";
    }

    if (
      !formValues.yearBuilt ||
      isNaN(formValues.yearBuilt) ||
      formValues.yearBuilt > 2025
    ) {
      errors.yearBuilt = "Debe ser un número válido, no mayor a 2025.";
    }

    if (!formValues.rentPrice || isNaN(formValues.rentPrice)) {
      errors.rentPrice = "Debe ser un número.";
    }

    if (!formValues.dateAvailable) {
      errors.dateAvailable = "Este campo es requerido.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  /*const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8080/flats/addFlat", formValues, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setTimeout(() => {
        setSuccessMessage("Flat creado con éxito.");
        setFormValues({
          city: "",
          streetName: "",
          streetNumber: "",
          areaSize: "",
          hasAc: false,
          yearBuilt: "",
          rentPrice: "",
          dateAvailable: "",
        });
        navigate("/MyFlats");
      }, 5000);
    } catch (error) {
      console.error("Error al guardar el flat:", error.response?.data?.message);
      setFormErrors({
        general: "Error al guardar el flat. Intenta de nuevo.",
      });
    }
  };*/

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8080/flats/addFlat", formValues, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      // Mostrar el mensaje de éxito
      setSuccessMessage("Flat creado con éxito.");

      // Restablecer el formulario
      setFormValues({
        city: "",
        streetName: "",
        streetNumber: "",
        areaSize: "",
        hasAc: false,
        yearBuilt: "",
        rentPrice: "",
        dateAvailable: "",
      });

      // Redirigir después de un breve retraso, si es necesario
      setTimeout(() => {
        navigate("/MyFlats");
      }, 3000); // Esperar 3 segundos para que el usuario vea el mensaje
    } catch (error) {
      console.error("Error al guardar el flat:", error.response?.data?.message);

      // Mostrar mensaje de error
      setFormErrors({
        general: "Error al guardar el flat. Intenta de nuevo.",
      });
    }
  };

  const handleReset = () => {
    setFormValues({
      city: "",
      streetName: "",
      streetNumber: "",
      areaSize: "",
      hasAc: false,
      yearBuilt: "",
      rentPrice: "",
      dateAvailable: "",
    });
    setFormErrors({});
  };

  return (
    <Box sx={{ p: 3, mt: 20 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#001f3d" }}
        >
          Añadir Nueva Propiedad
        </Typography>
        {successMessage && (
          <Typography sx={{ color: "green", textAlign: "center", mb: 2 }}>
            {successMessage}
          </Typography>
        )}
        {formErrors.general && (
          <Typography sx={{ color: "red", textAlign: "center", mb: 2 }}>
            {formErrors.general}
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Ciudad"
              name="city"
              fullWidth
              value={formValues.city}
              onChange={handleInputChange}
              error={!!formErrors.city}
              helperText={formErrors.city}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre de la Calle"
              name="streetName"
              fullWidth
              value={formValues.streetName}
              onChange={handleInputChange}
              error={!!formErrors.streetName}
              helperText={formErrors.streetName}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Número de Calle"
              name="streetNumber"
              fullWidth
              value={formValues.streetNumber}
              onChange={handleInputChange}
              error={!!formErrors.streetNumber}
              helperText={formErrors.streetNumber}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Área de Construcción (m²)"
              name="areaSize"
              fullWidth
              value={formValues.areaSize}
              onChange={handleInputChange}
              error={!!formErrors.areaSize}
              helperText={formErrors.areaSize}
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
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography>¿Tiene Aire Acondicionado?</Typography>
              <RadioGroup
                row
                name="hasAc"
                value={String(formValues.hasAc)}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    hasAc: e.target.value === "true",
                  })
                }
              >
                <FormControlLabel value="true" control={<Radio />} label="Sí" />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Año de Construcción"
              name="yearBuilt"
              type="number"
              fullWidth
              value={formValues.yearBuilt}
              onChange={handleInputChange}
              error={!!formErrors.yearBuilt}
              helperText={formErrors.yearBuilt}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Precio de Renta"
              name="rentPrice"
              fullWidth
              value={formValues.rentPrice}
              onChange={handleInputChange}
              error={!!formErrors.rentPrice}
              helperText={formErrors.rentPrice}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha Disponible"
              name="dateAvailable"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true, // Asegura que el label permanezca sobre el input
              }}
              value={formValues.dateAvailable}
              onChange={handleInputChange}
              error={!!formErrors.dateAvailable}
              helperText={formErrors.dateAvailable}
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
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: "#179fba",
                "&:hover": {
                  backgroundColor: "#137d94", // Color ligeramente más oscuro al pasar el mouse
                },
              }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{ ml: 2 }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NewFlat;
