/*import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

const Flats = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generar una URL de imagen aleatoria para cada flat
  const getRandomImage = (index) =>
    `https://picsum.photos/300/300?flats=${index}`;

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/flats/getAllFlats"
        );
        // Agregar una propiedad "imageUrl" con una imagen aleatoria a cada flat
        const flatsWithImages = response.data.map((flat, index) => ({
          ...flat,
          imageUrl: getRandomImage(index + 1),
        }));
        setFlats(flatsWithImages);
      } catch (error) {
        console.error("Error al obtener los flats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();
  }, []);

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
                image={flat.imageUrl} // Imagen aleatoria asignada
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
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Flats;
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

const Flats = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchFlats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/flats/getAllFlats"
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
  }, []);

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
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Flats;
