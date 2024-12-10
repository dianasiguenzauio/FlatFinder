//Componente para crear flat
/*
import React, { useState, useContext } from "react";
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
  const { auth } = useContext(AuthContext); // Contexto de autenticación
  const [formValues, setFormValues] = useState({
    city: "",
    streetname: "",
    streetnumber: "",
    areaSize: "",
    hasAc: false,
    yeartBuilt: "",
    rentPrice: "",
    dateAvailable: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const errors = {};
    const textRegex = /^[a-zA-Z]{1,20}$/;
    const numberRegex = /^\d{1,8}$/;
    const yearLimit = 2025;

    if (!formValues.city || !textRegex.test(formValues.city)) {
      errors.city = "Solo letras, máximo 20 caracteres.";
    }

    if (!formValues.streetname || !textRegex.test(formValues.streetname)) {
      errors.streetname = "Solo letras, máximo 20 caracteres.";
    }

    if (!formValues.streetnumber || !textRegex.test(formValues.streetnumber)) {
      errors.streetnumber = "Solo letras, máximo 20 caracteres.";
    }

    if (!formValues.areaSize || !numberRegex.test(formValues.areaSize)) {
      errors.areaSize = "Solo números, máximo 8 caracteres.";
    }

    if (
      !formValues.yeartBuilt ||
      new Date(formValues.yeartBuilt).getFullYear() > yearLimit
    ) {
      errors.yeartBuilt = "El año no puede superar 2025.";
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

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/flats/addFlat",
        formValues,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSuccessMessage("Flat guardado con éxito.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setFormValues({
        city: "",
        streetname: "",
        streetnumber: "",
        areaSize: "",
        hasAc: false,
        yeartBuilt: "",
        rentPrice: "",
        dateAvailable: "",
      });
    } catch (error) {
      console.error("Error al guardar el flat:", error.response?.data?.message);
      setFormErrors({
        general: "Error al guardar el flat. Intenta de nuevo.",
      });
    }
  };

  const handleReset = () => {
    setFormValues({
      city: "",
      streetname: "",
      streetnumber: "",
      areaSize: "",
      hasAc: false,
      yeartBuilt: "",
      rentPrice: "",
      dateAvailable: "",
    });
    setFormErrors({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Añadir Nuevo Flat
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre de la Calle"
              name="streetname"
              fullWidth
              value={formValues.streetname}
              onChange={handleInputChange}
              error={!!formErrors.streetname}
              helperText={formErrors.streetname}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Número de Calle"
              name="streetnumber"
              fullWidth
              value={formValues.streetnumber}
              onChange={handleInputChange}
              error={!!formErrors.streetnumber}
              helperText={formErrors.streetnumber}
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
              name="yeartBuilt"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formValues.yeartBuilt}
              onChange={handleInputChange}
              error={!!formErrors.yeartBuilt}
              helperText={formErrors.yeartBuilt}
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha Disponible"
              name="dateAvailable"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formValues.dateAvailable}
              onChange={handleInputChange}
              error={!!formErrors.dateAvailable}
              helperText={formErrors.dateAvailable}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mx: 1 }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{ mx: 1 }}
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
*/
import React, { useState, useContext } from "react";
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
      !alphanumericWithSpacesRegexx.test(formValues.streetName)
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

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8080/flats/addFlat", formValues, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setSuccessMessage("Flat guardado con éxito.");
      setTimeout(() => setSuccessMessage(""), 3000);
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
    } catch (error) {
      console.error("Error al guardar el flat:", error.response?.data?.message);
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
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Añadir Nuevo Flat
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha Disponible"
              name="dateAvailable"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formValues.dateAvailable}
              onChange={handleInputChange}
              error={!!formErrors.dateAvailable}
              helperText={formErrors.dateAvailable}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mx: 1 }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{ mx: 1 }}
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
