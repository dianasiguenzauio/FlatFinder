//Componente para mostrar informacion individual de un flat
//Pagina para ver la informacion detallada de un flat

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from ".././../config/firebase";

function VerDetallePage() {
  const { flatId } = useParams(); // Obtener el ID del flat desde los parámetros de la URL
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFlatDetails = async () => {
      try {
        const flatDocRef = doc(db, "flats", flatId);
        const flatDoc = await getDoc(flatDocRef);

        if (flatDoc.exists()) {
          setFlat({ id: flatDoc.id, ...flatDoc.data() });
        } else {
          setError("El flat no existe.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al recuperar los detalles del flat: ", err);
        setError(
          "Error al cargar los detalles del flat. Por favor, intenta nuevamente."
        );
        setLoading(false);
      }
    };

    fetchFlatDetails();
  }, [flatId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Detalles del Flat</h2>
      {flat ? (
        <div>
          <p>
            <strong>Ciudad:</strong> {flat.city}
          </p>
          <p>
            <strong>Calle:</strong> {flat.streetname}
          </p>
          <p>
            <strong>Número:</strong> {flat.streetnumber}
          </p>
          <p>
            <strong>Área (m²):</strong> {flat.areasize}
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
        </div>
      ) : (
        <p>No hay detalles disponibles para este flat.</p>
      )}
    </div>
  );
}

export default VerDetallePage;
