/*
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AuthContext from "../../context/authContext";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";

const UserMessages = () => {
  const { auth } = useContext(AuthContext);
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!auth.token) {
          setError("Usuario no autenticado.");
          return;
        }

        // Obtener el ID del usuario desde el token
        const decodedToken = jwtDecode(auth.token);
        const userId = decodedToken.user_id;
        if (!flatId || !userId) {
          setError("Faltan parámetros requeridos para la consulta.");
          return;
        }
        // Consumir el servicio para obtener los mensajes del usuario logueado

        const response = await axios.get(
          `http://localhost:8080/flats/${flatId}/messages/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        setMessagesData(response.data);
      } catch (err) {
        console.error("Error al obtener los mensajes:", err);
        setError("No se pudieron cargar los mensajes. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [auth.token, flatId]);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        {error}
      </div>
    );
  }

  if (messagesData.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No has enviado ningún mensaje.</Typography>
      </div>
    );
  }

  return (
    <div>
      <h1>Mensajes para el Flat</h1>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div">
            Flat en {messagesData.flatDetails.city}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dirección: {messagesData.flatDetails.streetName}{" "}
            {messagesData.flatDetails.streetNumber}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.primary"
            style={{ marginTop: "10px" }}
          >
            Mensajes Enviados:
          </Typography>
          {messagesData.messages.map((message, idx) => (
            <Typography
              key={idx}
              variant="body2"
              style={{ marginBottom: "5px" }}
            >
              - {message.content}
            </Typography>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserMessages;
*/
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AuthContext from "../../context/authContext";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const UserMessages = () => {
  const { auth } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [messagesData, setMessagesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!auth.token) {
          setError("Usuario no autenticado.");
          return;
        }

        // Obtener todos los flats disponibles
        const response = await axios.get(
          "http://localhost:8080/flats/getAllFlats",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        setFlats(response.data);
      } catch (err) {
        console.error("Error al obtener los flats:", err);
        setError("No se pudieron cargar los flats. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();
  }, [auth.token]);

  const fetchMessages = async (flatId) => {
    try {
      setLoading(true);
      setError(null);

      if (!auth.token) {
        setError("Usuario no autenticado.");
        return;
      }

      // Decodificar el token para obtener el ID del usuario logueado
      const decodedToken = jwtDecode(auth.token);
      const userId = decodedToken.user_id;

      // Obtener mensajes del flat seleccionado
      const response = await axios.get(
        `http://localhost:8080/flats/${flatId}/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setMessagesData(response.data);
    } catch (err) {
      console.error("Error al obtener los mensajes:", err);
      setError("No se pudieron cargar los mensajes. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlatSelect = (flatId) => {
    setSelectedFlat(flatId);
    fetchMessages(flatId);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Centra horizontalmente
        alignItems: "center", // Centra verticalmente
        height: "100vh", // Ocupa toda la altura de la pantalla
        backgroundColor: "#f5f5f5", // Fondo gris claro opcional
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          maxWidth: "600px",
          width: "100%", // Asegura que no exceda el ancho permitido
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#001f3d" }}>
          Mensajes por Flat
        </h1>

        <FormControl
          fullWidth
          id="flat-select-label"
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "2px solid purple",
              },
              "&:hover fieldset": {
                borderColor: "darkviolet",
              },
              "&.Mui-focused fieldset": {
                borderColor: "purple",
              },
            },
          }}
        >
          <InputLabel
            sx={{
              backgroundColor: "white",
              paddingX: "4px",
              transform: "translate(14px, -6px) scale(0.75)",
            }}
          >
            Selecciona un Flat
          </InputLabel>
          <Select
            labelId="flat-select-label"
            value={selectedFlat || ""}
            onChange={(e) => handleFlatSelect(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                padding: "12px",
              },
            }}
          >
            {flats.map((flat) => (
              <MenuItem key={flat._id} value={flat._id}>
                {flat.city}, {flat.streetName} {flat.streetNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {messagesData ? (
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Flat en {messagesData.flatDetails.city}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dirección: {messagesData.flatDetails.streetName}{" "}
                {messagesData.flatDetails.streetNumber}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.primary"
                style={{ marginTop: "10px" }}
              >
                Mensajes Enviados:
              </Typography>
              {messagesData.messages.map((messages, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  style={{ marginBottom: "5px" }}
                >
                  - {messages.content}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            style={{ textAlign: "center" }}
          >
            Selecciona un flat para ver los mensajes.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default UserMessages;
