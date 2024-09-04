//Componente para listar los flats
/*
import { useState, useEffect } from "react";
import { getFlats } from "../../services/firebase";

//Componente para listar los flats
const FlatList = () => {
  const [flats, setFlats] = useState([]);

  // Función para obtener los datos de Firebase
  const fetchFlats = async () => {
    const flats = await getFlats();
    setFlats(flats);
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  return (
    <div>
      <h2>Lista de Flats</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Ciudad</th>
            <th>Calle</th>
            <th>Número</th>
            <th>Área (m²)</th>
            <th>Aire Acondicionado</th>
            <th>Año de Construcción</th>
            <th>Precio de Renta</th>
            <th>Fecha Disponible</th>
          </tr>
        </thead>
        <tbody>
          {flats.map((flat) => (
            <tr key={flat.id}>
              <td> {flat.city}</td>
              <td>{flat.streetname} </td>
              <td>{flat.streetnumber} </td>
              <td>{flat.areasize} m² </td>
              <td>{flat.hasac ? "Sí" : "No"} </td>
              <td> {flat.yearbuilt} </td>
              <td>{flat.rentprice} </td>
              <td> {flat.dateavaliable} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlatList;
*/
/*
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Navigate } from "react-router-dom";

function AllFlats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener todos los flats
        const flatsCollection = collection(db, "flats");
        const querySnapshot = await getDocs(flatsCollection);

        const flatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los flats: ", err);
        setError("Error al cargar los flats. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchFlats();
  }, [storedUser]);

  // Función para manejar el cambio de estado de favorito
  const handleFavoriteToggle = async (flatId, currentFavorite) => {
    try {
      const flatDocRef = doc(db, "flats", flatId);

      // Actualizar el campo 'favorite' en el documento del flat
      await updateDoc(flatDocRef, { favorite: !currentFavorite });

      // Actualizar el estado local de flats
      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat.id === flatId ? { ...flat, favorite: !currentFavorite } : flat
        )
      );
    } catch (err) {
      console.error("Error al actualizar favoritos: ", err);
      setError("Error al actualizar favoritos. Por favor, intenta nuevamente.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Todos los Flats</h2>
      {flats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Área (m²)</th>
              <th>Año de Construcción</th>
              <th>Precio de Renta</th>
              <th>Fecha Disponible</th>
              <th>Correo Propietario</th>
              <th> Flat</th>
              <th>Favorito</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.city}</td>
                <td>{flat.streetname}</td>
                <td>{flat.streetnumber}</td>
                <td>{flat.areasize}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>{flat.userEmail} </td>
                <td>
                  <button>Ver Flat</button>{" "}
                </td>
                <td>
                  <button
                    onClick={() => handleFavoriteToggle(flat.id, flat.favorite)}
                  >
                    {flat.favorite
                      ? "Quitar de favoritos"
                      : "Marcar como favorito"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay flats disponibles.</p>
      )}
    </div>
  );
}

export default AllFlats;
*/
/*nuevo
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function AllFlats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener todos los flats
        const flatsCollection = collection(db, "flats");
        const querySnapshot = await getDocs(flatsCollection);

        const flatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los flats: ", err);
        setError("Error al cargar los flats. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchFlats();
  }, [storedUser]);

  // Función para manejar el cambio de estado de favorito
  const handleFavoriteToggle = async (flatId, currentFavorite) => {
    try {
      const flatDocRef = doc(db, "flats", flatId);

      // Actualizar el campo 'favorite' en el documento del flat
      await updateDoc(flatDocRef, { favorite: !currentFavorite });

      // Actualizar el estado local de flats
      setFlats((prevFlats) =>
        prevFlats.map((flat) =>
          flat.id === flatId ? { ...flat, favorite: !currentFavorite } : flat
        )
      );
    } catch (err) {
      console.error("Error al actualizar favoritos: ", err);
      setError("Error al actualizar favoritos. Por favor, intenta nuevamente.");
    }
  };

  // Función para manejar la navegación a la página de detalles del flat
  const handleViewDetails = (flatId) => {
    // navigate(`/FlatDetailsPage/${flatId}`);
    window.open(`/FlatDetailsPage/${flatId}`, "_blank");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Todos los Flats</h2>
      {flats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Área (m²)</th>
              <th>Año de Construcción</th>
              <th>Precio de Renta</th>
              <th>Fecha Disponible</th>
              <th>Favorito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.city}</td>
                <td>{flat.streetname}</td>
                <td>{flat.streetnumber}</td>
                <td>{flat.areasize}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>
                  <button
                    onClick={() => handleFavoriteToggle(flat.id, flat.favorite)}
                  >
                    {flat.favorite
                      ? "Quitar de favoritos"
                      : "Marcar como favorito"}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleViewDetails(flat.id)}>
                    Ver Flat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay flats disponibles.</p>
      )}
    </div>
  );
}

export default AllFlats;
*/
//nuevo2

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function AllFlats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener todos los flats
        const flatsCollection = collection(db, "flats");
        const querySnapshot = await getDocs(flatsCollection);

        const flatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los flats: ", err);
        setError("Error al cargar los flats. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchFlats();
  }, []);

  // Función para manejar el cambio de estado de favorito
  const handleFavoriteToggle = async (flat) => {
    try {
      const flatDocRef = doc(db, "flats", flat.id);

      // Determinar el nuevo estado de favorito y el campo userFavorite
      const newFavoriteState = !flat.favorite;
      const userFavoriteEmail = newFavoriteState ? storedUser.email : "";

      // Actualizar el campo 'favorite' y 'userFavorite' en el documento del flat
      await updateDoc(flatDocRef, {
        favorite: newFavoriteState,
        userFavorite: userFavoriteEmail,
      });

      // Actualizar el estado local de flats
      setFlats((prevFlats) =>
        prevFlats.map((f) =>
          f.id === flat.id
            ? {
                ...f,
                favorite: newFavoriteState,
                userFavorite: userFavoriteEmail,
              }
            : f
        )
      );
    } catch (err) {
      console.error("Error al actualizar favoritos: ", err);
      setError("Error al actualizar favoritos. Por favor, intenta nuevamente.");
    }
  };

  // Función para manejar la navegación a la página de detalles del flat
  const handleViewDetails = (flatId) => {
    window.open(`/FlatDetailsPage/${flatId}`, "_blank");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Todos los Flats</h2>
      {flats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Área (m²)</th>
              <th>Año de Construcción</th>
              <th>Precio de Renta</th>
              <th>Fecha Disponible</th>
              <th>Usuario Propietario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.city}</td>
                <td>{flat.streetname}</td>
                <td>{flat.streetnumber}</td>
                <td>{flat.areasize}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>{flat.userEmail}</td>
                <td>
                  <button onClick={() => handleFavoriteToggle(flat)}>
                    {flat.favorite
                      ? "Quitar de favoritos"
                      : "Marcar como favorito"}
                  </button>
                  <button onClick={() => handleViewDetails(flat.id)}>
                    Ver Flat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay flats disponibles.</p>
      )}
    </div>
  );
}

export default AllFlats;
