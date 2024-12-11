/*
import React, { useState, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import AuthContext from "../../context/authContext";

const FlatsOwner = () => {
  const { auth } = useContext(AuthContext); // Contexto para el token y usuario logueado
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/flats/getAllFlats",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        // Decodificar el token para obtener el user_id
        const decodedToken = jwtDecode(auth.token);
        const userId = decodedToken.user_id;

        // Filtrar los flats que pertenecen al usuario logueado
        const userFlats = response.data.filter(
          (flat) => flat.ownerId === userId
        );
        setFlats(userFlats);
      } catch (error) {
        console.error(
          "Error al cargar los flats:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchFlats();
  }, [auth]);

  const handleEditClick = (flat) => {
    setSelectedFlat(flat);
    setFormValues(flat);
  };

  const handleDeleteClick = async (flatId) => {
    try {
      await axios.delete(`http://localhost:8080/flats/deletedFlat/${flatId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setSuccessMessage("Flat eliminado correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Eliminar el flat de la lista local
      setFlats((prevFlats) => prevFlats.filter((flat) => flat._id !== flatId));
    } catch (error) {
      console.error(
        "Error al eliminar el flat:",
        error.response?.data?.message
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === "hasAc" ? value === "true" : value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.city) errors.city = "La ciudad es obligatoria.";
    if (!formValues.streetName) errors.streetName = "La calle es obligatoria.";
    if (!formValues.rentPrice) errors.rentPrice = "El precio es obligatorio.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.patch(
        `http://localhost:8080/flats/updateFlat/${selectedFlat._id}`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setSuccessMessage("Datos actualizados correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);

      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat._id === selectedFlat._id ? { ...flat, ...formValues } : flat
        )
      );
      setSelectedFlat(null);
    } catch (error) {
      console.error(
        "Error al actualizar el flat:",
        error.response?.data?.message
      );
    }
  };

  const handleCancel = () => {
    setSelectedFlat(null);
    setFormValues({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Mis Flats
      </Typography>
      {successMessage && (
        <Typography sx={{ color: "green", textAlign: "center", mb: 2 }}>
          {successMessage}
        </Typography>
      )}
      <Grid container spacing={3}>
        {flats.map((flat) => (
          <Grid item xs={12} sm={6} md={4} key={flat._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Ciudad: {flat.city}</Typography>
                <Typography>Calle: {flat.streetName}</Typography>
                <Typography>Precio: ${flat.rentPrice}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(flat)}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteClick(flat._id)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedFlat && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">Editar Flat</Typography>
          <TextField
            label="Ciudad"
            name="city"
            value={formValues.city || ""}
            onChange={handleInputChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Calle"
            name="streetName"
            value={formValues.streetName || ""}
            onChange={handleInputChange}
            error={!!formErrors.streetName}
            helperText={formErrors.streetName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Número de Calle"
            name="streetNumber"
            value={formValues.streetNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Área (m²)"
            name="areaSize"
            type="number"
            value={formValues.areaSize || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <RadioGroup
            row
            name="hasAc"
            value={formValues.hasAc ? "true" : "false"}
            onChange={handleInputChange}
          >
            <FormControlLabel value="true" control={<Radio />} label="Con AC" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Sin AC"
            />
          </RadioGroup>
          <TextField
            label="Precio"
            name="rentPrice"
            type="number"
            value={formValues.rentPrice || ""}
            onChange={handleInputChange}
            error={!!formErrors.rentPrice}
            helperText={formErrors.rentPrice}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Año de Construcción"
            name="yearBuilt"
            value={formValues.yearBuilt || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Disponibilidad"
            name="dateAvailable"
            type="date"
            value={formValues.dateAvailable || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ ml: 2 }}
            >
              Cancelar
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default FlatsOwner;
*/
import React, { useState, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import AuthContext from "../../context/authContext";

const FlatsOwner = () => {
  const { auth } = useContext(AuthContext); // Contexto para el token y usuario logueado
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/flats/getAllFlats",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const decodedToken = jwtDecode(auth.token);
        const userId = decodedToken.user_id;

        const userFlats = response.data.filter(
          (flat) => flat.ownerId === userId
        );
        setFlats(userFlats);
      } catch (error) {
        console.error(
          "Error al cargar los flats:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchFlats();
  }, [auth]);

  const handleEditClick = (flat) => {
    setSelectedFlat(flat);
    setFormValues(flat);
  };

  const handleDeleteClick = async (flatId) => {
    try {
      await axios.delete(`http://localhost:8080/flats/deletedFlat/${flatId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setSuccessMessage("Flat eliminado correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);

      setFlats((prevFlats) => prevFlats.filter((flat) => flat._id !== flatId));
    } catch (error) {
      console.error(
        "Error al eliminar el flat:",
        error.response?.data?.message
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: name === "hasAc" ? value === "true" : value,
    });
  };

  const validateForm = () => {
    const errors = {};
    const cityRegex = /^[a-zA-Z]{1,20}$/;
    const streetRegex = /^[a-zA-Z0-9\s]{1,20}$/;
    const numberRegex = /^[0-9]{1,8}$/;

    if (!cityRegex.test(formValues.city || "")) {
      errors.city = "Ciudad: Solo letras, máximo 20 caracteres.";
    }
    if (!streetRegex.test(formValues.streetName || "")) {
      errors.streetName =
        "Calle: Letras, números, espacios, máximo 20 caracteres.";
    }
    if (!streetRegex.test(formValues.streetNumber || "")) {
      errors.streetNumber =
        "Número de calle: Letras, números, espacios, máximo 20 caracteres.";
    }
    if (!numberRegex.test(formValues.areaSize || "")) {
      errors.areaSize = "Área: Solo números, máximo 8 caracteres.";
    }
    if (!numberRegex.test(formValues.rentPrice || "")) {
      errors.rentPrice = "Precio: Solo números, máximo 8 caracteres.";
    }
    if (!numberRegex.test(formValues.yearBuilt || "")) {
      errors.yearBuilt =
        "Año de construcción: Solo números, máximo 8 caracteres.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.patch(
        `http://localhost:8080/flats/updateFlat/${selectedFlat._id}`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setSuccessMessage("Datos actualizados correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);

      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat._id === selectedFlat._id ? { ...flat, ...formValues } : flat
        )
      );
      setSelectedFlat(null);
    } catch (error) {
      console.error(
        "Error al actualizar el flat:",
        error.response?.data?.message
      );
    }
  };

  const handleCancel = () => {
    setSelectedFlat(null);
    setFormValues({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Mis Flats
      </Typography>
      {successMessage && (
        <Typography sx={{ color: "green", textAlign: "center", mb: 2 }}>
          {successMessage}
        </Typography>
      )}
      <Grid container spacing={3}>
        {flats.map((flat) => (
          <Grid item xs={12} sm={6} md={4} key={flat._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Ciudad: {flat.city}</Typography>
                <Typography>Calle: {flat.streetName}</Typography>
                <Typography>Precio: ${flat.rentPrice}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(flat)}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteClick(flat._id)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedFlat && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">Editar Flat</Typography>
          <TextField
            label="Ciudad"
            name="city"
            value={formValues.city || ""}
            onChange={handleInputChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Calle"
            name="streetName"
            value={formValues.streetName || ""}
            onChange={handleInputChange}
            error={!!formErrors.streetName}
            helperText={formErrors.streetName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Número de Calle"
            name="streetNumber"
            value={formValues.streetNumber || ""}
            onChange={handleInputChange}
            error={!!formErrors.streetNumber}
            helperText={formErrors.streetNumber}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Área (m²)"
            name="areaSize"
            type="text"
            value={formValues.areaSize || ""}
            onChange={handleInputChange}
            error={!!formErrors.areaSize}
            helperText={formErrors.areaSize}
            fullWidth
            margin="normal"
          />
          <RadioGroup
            row
            name="hasAc"
            value={formValues.hasAc ? "true" : "false"}
            onChange={handleInputChange}
          >
            <FormControlLabel value="true" control={<Radio />} label="Con AC" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Sin AC"
            />
          </RadioGroup>
          <TextField
            label="Precio"
            name="rentPrice"
            type="text"
            value={formValues.rentPrice || ""}
            onChange={handleInputChange}
            error={!!formErrors.rentPrice}
            helperText={formErrors.rentPrice}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Año de Construcción"
            name="yearBuilt"
            type="text"
            value={formValues.yearBuilt || ""}
            onChange={handleInputChange}
            error={!!formErrors.yearBuilt}
            helperText={formErrors.yearBuilt}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Disponibilidad"
            name="dateAvailable"
            type="date"
            value={formValues.dateAvailable || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ ml: 2 }}
            >
              Cancelar
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default FlatsOwner;
