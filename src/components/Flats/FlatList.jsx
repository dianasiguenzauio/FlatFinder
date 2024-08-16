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
      <ul>
        {flats.map((flat) => (
          <li key={flat.id}>
            Ciudad: {flat.city} <br />
            Calle: {flat.streetname} <br />
            Número: {flat.streetnumber} <br />
            Área: {flat.areasize} m² <br />
            Aire Acondicionado: {flat.hasac ? "Sí" : "No"} <br />
            Año de Construcción: {flat.yearbuilt} <br />
            Precio de Renta: ${flat.rentprice} <br />
            Fecha Disponible: {flat.dateavaliable} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlatList;
