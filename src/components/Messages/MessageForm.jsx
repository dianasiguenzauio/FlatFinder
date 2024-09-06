//Componente para enviar el mensaje

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

function MessagePage() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null); // Almacena el flat seleccionado
  const [messageContent, setMessageContent] = useState("");
  const messageFormRef = useRef(null); // Referencia para el formulario de mensajes

  const styles = {
    gridContainer: {
      color: "black",
      maxWidth: "1400px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      padding: "20px",
      justifyContent: "center", // Centrar las cards
      backgroundColor: "#303030",
    },
    card: {
      backgroundColor: "white",
      border: "1px solid #5193ce",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(10, 10, 10, 0.1)",
      transition: "transform 0.3s ease",
      textAlign: "left",
    },
    messageForm: {
      maxWidth: "500px",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #5193ce",
      borderRadius: "10px",
      backgroundColor: "#121439",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      textAlign: "left", // Alinea el texto y los elementos a la izquierda
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
    },
    textarea: {
      backgroundColor: "white",
      color: "black",
      width: "100%",
      height: "100px",
      padding: "5px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },

    sendMessageButton: {
      backgroundColor: "#28a745", // Verde para el botón "Enviar Mensaje"
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
    },

    submitButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
    },
  };

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

    // Mover el foco al formulario
    setTimeout(() => {
      if (messageFormRef.current) {
        messageFormRef.current.scrollIntoView({ behavior: "smooth" });
        messageFormRef.current.focus(); // Mover el foco al formulario
      }
    }, 100);
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
    <div style={{ textAlign: "center" }}>
      <h2>Flats de usuarios</h2>
      {flats.length > 0 ? (
        <div style={styles.gridContainer}>
          {flats.map((flat) => (
            <div key={flat.id} style={styles.card}>
              <h3>{flat.city}</h3>
              <p>
                <strong>Calle:</strong> {flat.streetname}
              </p>
              <p>
                <strong>Número:</strong> {flat.streetnumber}
              </p>
              <p>
                <strong>Área:</strong> {flat.areasize} m²
              </p>
              <p>
                <strong>Aire Acondicionado:</strong> {flat.hasac ? "Sí" : "No"}
              </p>
              <p>
                <strong>Año de Construcción:</strong> {flat.yearbuilt}
              </p>
              <p>
                <strong>Precio de Renta:</strong> {flat.rentprice}
              </p>
              <p>
                <strong>Fecha Disponible:</strong> {flat.dateavaliable}
              </p>
              <p>
                <strong>Propietario:</strong> {flat.userEmail}
              </p>
              <button
                onClick={() => handleSendMessageClick(flat)}
                style={styles.sendMessageButton} // Aplicar el estilo verde aquí
              >
                Enviar Mensaje
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay flats registrados.</p>
      )}

      {showMessageForm && selectedFlat && (
        <form
          onSubmit={handleSendMessage}
          ref={messageFormRef} // Asignamos la referencia
          style={styles.messageForm}
        >
          <h3>Enviar Mensaje</h3>
          <label style={styles.label}>
            Fecha del Mensaje:
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
            />
          </label>
          <label style={styles.label}>
            Email:
            <input type="text" value={storedUser.email} disabled />
          </label>
          <label style={styles.label}>
            Contenido del Mensaje:
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
              style={styles.textarea}
            />
          </label>
          <button type="submit" style={styles.submitButton}>
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}

export default MessagePage;
