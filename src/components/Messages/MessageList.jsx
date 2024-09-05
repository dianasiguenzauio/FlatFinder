import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

function MisMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuario almacenado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!storedUser || !storedUser.email) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        // Consulta para obtener los mensajes dirigidos al usuario logueado
        const messagesQuery = query(
          collection(db, "mesagges"),
          where("userEmail", "==", storedUser.email)
        );

        const querySnapshot = await getDocs(messagesQuery);
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(messagesData);
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los mensajes: ", err);
        setError(
          "Error al cargar los mensajes. Por favor, intenta nuevamente."
        );
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Mensajes de mis flats</h2>
      {messages.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Email Remitente</th>
              <th>Fecha del mensaje</th>
              <th>Mensaje</th>
              <th>Ciudad</th>
              <th>Calle</th>
              <th>Numeracion</th>
              <th>Área de construcción (m²)</th>
              <th>Fecha disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.email}</td>
                <td>
                  {new Date(
                    message.marcatiempo.seconds * 1000
                  ).toLocaleString()}
                </td>
                <td>{message.message}</td>
                <td>{message.city}</td>
                <td>{message.streetname}</td>
                <td>{message.streetnumber}</td>
                <td>{message.areasize} m²</td>
                <td>{message.dateavaliable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes mensajes.</p>
      )}
    </div>
  );
}

export default MisMessages;
