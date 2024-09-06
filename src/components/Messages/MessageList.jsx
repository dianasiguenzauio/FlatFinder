import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import styled from "styled-components";

// Estilos del contenedor de los mensajes
const MessagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

// Estilos de cada card de mensaje
const MessageCard = styled.div`
  background-color: #fff;

  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Título y contenido del mensaje
const MessageTitle = styled.h3`
  font-size: 1.2rem;
  color: #03a5ba;
  margin-bottom: 10px;
`;

const MessageContent = styled.p`
  font-size: 1rem;
  color: #100126;
  margin-bottom: 15px;
`;

const MisMessages = () => {
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
    <div style={{ textAlign: "center" }}>
      <h2>Mis Mensajes</h2>
      {messages.length > 0 ? (
        <MessagesContainer>
          {messages.map((message) => (
            <MessageCard key={message.id}>
              <MessageTitle>Email Remitente: {message.email}</MessageTitle>
              <MessageContent>
                Fecha del mensaje:{" "}
                {new Date(message.marcatiempo.seconds * 1000).toLocaleString()}
              </MessageContent>
              <MessageContent>Mensaje: {message.message}</MessageContent>
              <MessageContent>Ciudad: {message.city}</MessageContent>
              <MessageContent>Calle: {message.streetname}</MessageContent>
              <MessageContent>Número: {message.streetnumber}</MessageContent>
              <MessageContent>Área: {message.areasize} m²</MessageContent>
              <MessageContent>
                Fecha Disponible: {message.dateavaliable}
              </MessageContent>
            </MessageCard>
          ))}
        </MessagesContainer>
      ) : (
        <p>No tienes mensajes.</p>
      )}
    </div>
  );
};

export default MisMessages;
