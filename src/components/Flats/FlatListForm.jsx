/*
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
} from "@mui/material";

const Flats = () => {
  const { auth } = useContext(AuthContext);
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

export default Flats;*/
//Agregar correctamente el flat favorito pero no se puede observar
/*
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
  Divider,
  Box,
} from "@mui/material";

const Flats = () => {
  const { auth } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);
  const [favouritesFlats, setFavouritesFlats] = useState([]);
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

        // Obtener los favoritos del usuario logueado
        const decodedToken = jwtDecode(auth.token);
        const userResponse = await axios.get(
          `http://localhost:8080/users/getUserById/${decodedToken.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setFavouritesFlats(userResponse.data.favouriteFlats || []);
      } catch (error) {
        console.error("Error al obtener los flats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();
  }, [auth]);

  const handleAddToFavourites = async (flatId) => {
    try {
      const decodedToken = jwtDecode(auth.token);

      // Actualizar el usuario en el backend
      const response = await axios.patch(
        `http://localhost:8080/users/addFavourite`,
        { flatId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setFavouritesFlats(response.data.favouriteFlats); // Actualizar la lista de favoritos localmente
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
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
                color="primary"
                onClick={() => handleAddToFavourites(flat._id)}
              >
                Marcar como Favorito
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
*/
{
  /* Separador y lista de favoritos */
} /*
      {Array.isArray(favouritesFlats) && favouritesFlats.length > 0 && (
        <Box mt={5}>
          <Divider />
          <Typography variant="h4" align="center" gutterBottom>
            Mis Flats Favoritos
          </Typography>
          <Grid container spacing={3}>
            {favouritesFlats.map((flatId) => {
              const flat = flats.find((f) => f._id === flatId);
              if (!flat) return null; // Si no encuentra el flat, lo ignora

              return (
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
                      <Typography variant="body1" color="text.primary">
                        Ubicación: {flat.city}, {flat.streetName}{" "}
                        {flat.streetNumber}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Precio: ${flat.rentPrice}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default Flats;*/
//////
/*
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
  Divider,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const Flats = () => {
  const { auth } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]); // Lista de IDs de flats favoritos

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
    try {
      // Actualizar el usuario en el backend
      const response = await axios.patch(
        `http://localhost:8080/users/addFavourite`,

        { flatId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // Actualizar el estado local
      setFavourites((prevFavourites) => [...prevFavourites, flatId]);
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
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
                  backgroundColor: favourites.includes(flat._id)
                    ? "red"
                    : "blue",
                  color: "white",
                }}
                onClick={() => handleAddToFavourites(flat._id)}
              >
                {favourites.includes(flat._id)
                  ? "Favorito"
                  : "Marcar como Favorito"}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Flats;*/

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
  const [favourites, setFavourites] = useState([]); // Lista de IDs de flats favoritos
  const [selectedUser, setSelectedUser] = useState(null);

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
        //        setFlats(response.data);
      } catch (error) {
        console.error("Error al obtener los flats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();
  }, [auth]);

  const handleAddToFavourites = async (flatId) => {
    try {
      // Verificar si el flat ya está en favoritos
      if (favourites.includes(flatId)) {
        // Si ya está, mostrar un mensaje o no hacer nada
        alert("Este flat ya está en tus favoritos.");
        return;
      }
      // Actualizar el usuario en el backend
      await axios.patch(
        `http://localhost:8080/users/addFavourite`,
        { flatId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // Actualizar el estado local
      setFavourites((prevFavourites) => [...prevFavourites, flatId]);
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
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
                  backgroundColor: favourites.includes(flat._id)
                    ? "white"
                    : "white",
                  color: "white",
                }}
                onClick={() => handleAddToFavourites(flat._id)}
              >
                {favourites.includes(flat._id) ? "  ❤️  " : "  🤍  "}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Flats;
