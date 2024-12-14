import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AuthContext from "../../context/authContext";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";

const Flats = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState("black");
  const [selectedFlat, setSelectedFlat] = useState(null); // Para el flat seleccionado
  const [messageContent, setMessageContent] = useState(""); // Para el contenido del mensaje
  const [dialogOpen, setDialogOpen] = useState(false);
  const [flatDetails, setFlatDetails] = useState(null); // Detalles del flat
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false); // Controla la tarjeta emergente

  // Variable para controlar si se usa Unsplash o imágenes predeterminadas
  const useUnsplash = false; // Cambia a `true` si deseas habilitar Unsplash

  // Conjunto de imágenes predeterminadas
  const fallbackImages = [
    "https://via.placeholder.com/300x300?text=Flat+1",
    "https://via.placeholder.com/300x300?text=Flat+2",
    "https://via.placeholder.com/300x300?text=Flat+3",
    "https://via.placeholder.com/300x300?text=Flat+4",
    "https://via.placeholder.com/300x300?text=Flat+5",
    "https://via.placeholder.com/300x300?text=Flat+1",
    "https://via.placeholder.com/300x300?text=Flat+2",
    "https://via.placeholder.com/300x300?text=Flat+3",
    "https://via.placeholder.com/300x300?text=Flat+4",
    "https://via.placeholder.com/300x300?text=Flat+5",
  ];

  const handleOpenMessageForm = (flatId) => {
    setSelectedFlat(flatId);
    setMessageContent(""); // Limpia el contenido del mensaje
  };

  const showMessage = (text, color) => {
    setMessage(text);
    setMessageColor(color);
    setTimeout(() => {
      setMessage(null); // Oculta el mensaje después de 3 segundos
    }, 3000);
  };

  // Generar una URL de imagen aleatoria para casas y departamentos
  const getRandomHouseImage = async () => {
    if (!useUnsplash) {
      const randomIndex = Math.floor(Math.random() * fallbackImages.length);
      return fallbackImages[randomIndex];
    }
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        query: "house",
        client_id: "Ef3APNsx319GjBB4sEGwcNogzOyzAmKfIDl3A--j1Wk",
      },
    });
    return response.data.urls.small; // URL de la imagen
  };

  useEffect(() => {
    // Decodificar el token para obtener el ID del usuario logueado
    if (auth.token) {
      const decodedToken = jwtDecode(auth.token);
      setUserId(decodedToken.user_id); // Ajusta si tu token tiene otro campo para el ID
    }
  }, [auth.token]);

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
        // Obtener imágenes para cada flat
        const flatsWithImages = await Promise.all(
          response.data.map(async (flat) => {
            const imageUrl = await getRandomHouseImage();
            return { ...flat, imageUrl };
          })
        );
        setFlats(flatsWithImages);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Si es un error 401 (No autenticado), mostrar el dialog
          setDialogOpen(true);
        } else {
          console.error("Error al obtener los flats:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFlats();
  }, [auth]);
  const handleDialogClose = () => {
    setDialogOpen(false);
    logout(); // Limpia el contexto si es necesario
    navigate("/login"); // Redirige al login
  };

  const handleAddToFavourites = async (flatId) => {
    const selectedFlat = flats.find((flat) => flat._id === flatId);
    // Comprobar si el flat ya está marcado como favorito
    if (selectedFlat?.isFavourite) {
      showMessage("Este flat ya está en tus favoritos.", "red");
      return;
    }
    try {
      if (!userId) {
        showMessage("Usuario no identificado.", "red");
        return;
      }

      // Consumir el servicio para agregar a favoritos
      await axios.patch(
        "http://localhost:8080/users/addFavourite",
        { flatId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // Actualizar el estado local para marcar el flat como favorito
      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat._id === flatId ? { ...flat, isFavourite: true } : flat
        )
      );

      showMessage("Flat agregado a favoritos exitosamente.", "green");
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
      showMessage("Ocurrió un error al agregar el flat a favoritos.", "red");
    }
  };
  //eliminar flat de favoritos
  const handleRemoveFromFavourites = async (flatId) => {
    try {
      if (!userId) {
        showMessage("Usuario no identificado.", "red");
        return;
      }

      // Consumir el servicio para eliminar de favoritos
      await axios.patch(
        "http://localhost:8080/users/removeFavourite",
        { flatId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // Actualizar el estado local para desmarcar el flat como favorito
      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat._id === flatId ? { ...flat, isFavourite: false } : flat
        )
      );

      showMessage("Flat eliminado de favoritos exitosamente.", "red");
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
      showMessage("Ocurrió un error al eliminar el flat de favoritos.", "red");
    }
  };

  //agregar mensaje en flat
  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      showMessage("El contenido del mensaje no puede estar vacío.", "red");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/flats/${selectedFlat}/messages`,
        { content: messageContent },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      showMessage("Mensaje enviado exitosamente.", "green");
      setSelectedFlat(null); // Cierra el formulario
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      showMessage("Ocurrió un error al enviar el mensaje.", "red");
    }
  };

  const handleViewDetails = async (flatId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/flats/getFlatById/${flatId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      //console.log(flatId);
      // console.log("Detalles del flat:", response.data);
      setFlatDetails(response.data); // Establece los detalles del flat
      setDetailsDialogOpen(true); // Abre la tarjeta emergente
      //console.log(data);
    } catch (error) {
      console.error("Error al obtener los detalles del flat:", error);
      showMessage("Error al obtener los detalles del flat.", "red");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setFlatDetails(null);
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

  return (
    <div style={{ marginTop: "200px" }}>
      <h1
        style={{ textAlign: "center", color: "#001f3d", position: "initial" }}
      >
        Flats Disponibles
      </h1>
      {message && (
        <div
          style={{ color: messageColor, textAlign: "center", margin: "10px 0" }}
        >
          {message}
        </div>
      )}

      <Grid container spacing={2} style={{ padding: "0 40px" }}>
        {flats.map((flat) => (
          <Grid item xs={12} sm={6} md={3} key={flat._id}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "10px",
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={
                  flat.imageUrl ||
                  "https://via.placeholder.com/300x300?text=No+Image"
                }
                alt={flat.title || "Imagen del flat"}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {flat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flat.description}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  Ubicación: {flat.city}, {flat.streetName} {flat.streetNumber}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Precio: ${flat.rentPrice}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                style={{
                  backgroundColor: flat.isFavourite ? "white" : "white",
                  color: "white",
                  marginTop: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() =>
                  flat.isFavourite
                    ? handleRemoveFromFavourites(flat._id)
                    : handleAddToFavourites(flat._id)
                }
              >
                {flat.isFavourite ? "❤️" : " 🖤"}
              </Button>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "purple",
                  color: "white",
                  marginTop: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => handleOpenMessageForm(flat._id)}
              >
                💬
              </Button>
              <Button
                variant="contained"
                style={{
                  marginTop: "10px",
                  backgroundColor: "#001f3d",
                  color: "white",
                }}
                onClick={() => handleViewDetails(flat._id)}
              >
                Ver más
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/*formulario de sms*/}
      {selectedFlat && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "20px 40px",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ color: "#001f3d" }}>Enviar Mensaje</h3>
          <textarea
            style={{
              width: "100%",
              minHeight: "100px",
              marginBottom: "10px",
              backgroundColor: "white",
              color: "black",
              border: "2px solid purple",
            }}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
          ></textarea>
          <div style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#179fba",
                color: "white",
                marginRight: "10px",
              }}
              onClick={handleSendMessage}
            >
              Enviar Mensaje
            </Button>
            <Button
              variant="outlined"
              style={{ color: "purple", borderColor: "purple" }}
              onClick={() => setSelectedFlat(null)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {/* Dialog para error 401 */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Usuario no autenticado</DialogTitle>
        <DialogContent>
          Tu sesión ha expirado o no tienes acceso. Por favor, inicia sesión
          nuevamente.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Ir a Login
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog para mostrar detalles del flat */}

      {flatDetails && (
        <Dialog
          open={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Detalles del Flat</DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary">
              Ubicación: {flatDetails.flatDetails.city},{" "}
              {flatDetails.flatDetails.streetName},{" "}
              {flatDetails.flatDetails.streetNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Area De Construccion:{flatDetails.flatDetails.areaSize} m2
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Aire Acondicionado:{flatDetails.flatDetails.hasAc}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Precio de renta: ${flatDetails.flatDetails.rentPrice}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Año de Construccion:{flatDetails.flatDetails.yearBuilt}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fecha de disponibilidad:{flatDetails.flatDetails.dateAvailable}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Informacion Actualizada:{flatDetails.flatDetails.updated}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email de dueño:{flatDetails.ownerEmail}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailsDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Flats;
