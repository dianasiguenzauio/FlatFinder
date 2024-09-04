//Componente para enviar el mensaje
/*
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import NavbarContainer from "../../components/Commons/Navbar";

function MessagePage() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedFlatId, setSelectedFlatId] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchFavoriteFlats = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener los flats que no son del usuario lgoeuado
        const flatsQuery = query(
          collection(db, "flats"),
          where("userEmail", "!=", storedUser.email)
        );

        const querySnapshot = await getDocs(flatsQuery);
        const flatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlats(flatsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los flats : ", err);
        setError("Error al cargar los flats. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchFavoriteFlats();
  }, []);

  const handleSendMessageClick = (flatId) => {
    setSelectedFlatId(flatId);
    setShowMessageForm(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const timestamp = new Date();
      const messageData = {
        email: storedUser.email,
        idflat: selectedFlatId,
        marcatiempo: timestamp,
        message: messageContent,
      };

      await addDoc(collection(db, "mesagges"), messageData);

      setShowMessageForm(false);
      setMessageContent("");
      alert("Mensaje enviado correctamente");
    } catch (err) {
      console.error("Error al enviar el mensaje: ", err);
      setError("Error al enviar el mensaje. Por favor, intenta nuevamente.");
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
      <NavbarContainer />
      <h2>Flats de usuarios</h2>
      {flats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
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
                <td>{flat.hasac ? "Sí" : "No"}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>
                  <button onClick={() => handleSendMessageClick(flat.id)}>
                    Enviar Mensaje
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes flats favoritos.</p>
      )}

      {showMessageForm && (
        <form onSubmit={handleSendMessage}>
          <h3>Enviar Mensaje</h3>
          <label>
            Fecha del Mensaje:
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
            />
          </label>
          <br />
          <br />
          <label>
            Email:
            <input type="text" value={storedUser.email} disabled />
          </label>
          <br />
          <label>
            Contenido del Mensaje:
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}

export default MessagePage;
*/
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import NavbarContainer from "../../components/Commons/Navbar";

function MessagePage() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null); // Almacena el flat seleccionado
  const [messageContent, setMessageContent] = useState("");

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

        // Consulta para obtener los flats que no son del usuario logueado
        const flatsQuery = query(
          collection(db, "flats"),
          where("userEmail", "!=", storedUser.email)
        );

        const querySnapshot = await getDocs(flatsQuery);
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

  const handleSendMessageClick = (flat) => {
    setSelectedFlat(flat); // Guardamos toda la información del flat seleccionado
    setShowMessageForm(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedFlat) {
      setError("No hay un flat seleccionado");
      return;
    }

    try {
      const timestamp = new Date();
      const messageData = {
        email: storedUser.email, // Email del usuario logueado
        idflat: selectedFlat.id, // ID del flat
        userEmail: selectedFlat.userEmail, // Email del propietario del flat
        city: selectedFlat.city, // Ciudad del flat
        streetname: selectedFlat.streetname,
        streetnumber: selectedFlat.streetnumber,
        areasize: selectedFlat.areasize, // Tamaño del área del flat
        dateavaliable: selectedFlat.dateavaliable, // Fecha de disponibilidad del flat
        marcatiempo: timestamp, // Timestamp actual
        message: messageContent, // Contenido del mensaje
      };

      // Insertar el mensaje en la colección "mesagges"
      await addDoc(collection(db, "mesagges"), messageData);

      setShowMessageForm(false);
      setMessageContent("");
      alert("Mensaje enviado correctamente");
    } catch (err) {
      console.error("Error al enviar el mensaje: ", err);
      setError("Error al enviar el mensaje. Por favor, intenta nuevamente.");
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
      <NavbarContainer />
      <h2>Flats de usuarios</h2>
      {flats.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Numeracion</th>
              <th>Área de construccion (m²)</th>
              <th>Aire Acondicionado</th>
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
                <td>{flat.hasac ? "Sí" : "No"}</td>
                <td>{flat.yearbuilt}</td>
                <td>{flat.rentprice}</td>
                <td>{flat.dateavaliable}</td>
                <td>{flat.userEmail}</td>
                <td>
                  <button onClick={() => handleSendMessageClick(flat)}>
                    Enviar Mensaje
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes flats favoritos.</p>
      )}

      {showMessageForm && selectedFlat && (
        <form onSubmit={handleSendMessage}>
          <h3>Enviar Mensaje</h3>
          <label>
            Fecha del Mensaje:
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
            />
          </label>
          <br />
          <label>
            Email:
            <input type="text" value={storedUser.email} disabled />
          </label>
          <br />
          <label>
            Contenido del Mensaje:
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}

export default MessagePage;
