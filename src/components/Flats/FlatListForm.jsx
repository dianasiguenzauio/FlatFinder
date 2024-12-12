import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AuthContext from "../../context/authContext";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";

const Flats = () => {
  const { auth } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Generar una URL de imagen aleatoria para casas y departamentos
  const getRandomHouseImage = async () => {
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
        console.error("Error al obtener los flats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlats();
  }, [auth]);

  const handleAddToFavourites = async (flatId) => {
    const selectedFlat = flats.find((flat) => flat._id === flatId);
    // Comprobar si el flat ya está marcado como favorito
    if (selectedFlat?.isFavourite) {
      alert("Este flat ya está en tus favoritos.");
      return;
    }
    try {
      if (!userId) {
        alert("Usuario no identificado.");
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

      alert("Flat agregado a favoritos exitosamente.");
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
      alert("Ocurrió un error al agregar el flat a favoritos.");
    }
  };
  //eliminar flat de favoritos
  const handleRemoveFromFavourites = async (flatId) => {
    try {
      if (!userId) {
        alert("Usuario no identificado.");
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

      alert("Flat eliminado de favoritos exitosamente.");
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
      alert("Ocurrió un error al eliminar el flat de favoritos.");
    }
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
    <div>
      <h1>Flats Disponibles</h1>
      <Grid container spacing={3}>
        {flats.map((flat) => (
          <Grid item xs={12} sm={6} md={4} key={flat._id}>
            <Card>
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
                }}
                onClick={() =>
                  flat.isFavourite
                    ? handleRemoveFromFavourites(flat._id)
                    : handleAddToFavourites(flat._id)
                }
              >
                {flat.isFavourite ? "❤️" : " 🖤"}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Flats;
