//Pagina para crear un nuevo flat
import { useEffect, useRef, useState } from "react";
import {
  createFlats,
  updateUser,
  getUserById,
  deleteUser,
  getFlats,
} from "../services/firebase";
import { number } from "prop-types";

function NewFlatPage() {
  const [flats, setFlats] = useState([]);

  const cityRef = useRef();
  const streetnameRef = useRef();
  const streetnumberRef = useRef();
  const areasizeRef = useRef();
  const hasacRef = useRef();
  const yearbuiltRef = useRef();
  const rentpriceRef = useRef();
  const dateavaliableRef = useRef();

  const fetchData = async () => {
    const flats = await getFlats();
    setFlats(flats);
  };

  const handleCreateFlats = async () => {
    await createFlats({
      city: cityRef.current.value,
      streetname: streetnameRef.current.value,
      streetnumberRef: Number(streetnumberRef.current.value),
      areasize: Number(areasizeRef.current.value),
      hasac: hasacRef.current.checked,
      yearbuilt: Number(yearbuiltRef.current.value),
      rentprice: Number(rentpriceRef.current.value),
      dateavaliable: dateavaliableRef.current.value,
    });
    await fetchData();
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <h1>Propiedades</h1>
      <div>
        <input type="text" placeholder="ciudad" ref={cityRef} /> <br />
        <input type="text" placeholder="Calle" ref={streetnameRef} /> <br />
        <input
          type="number"
          placeholder="numeracion"
          ref={streetnumberRef}
        />{" "}
        <br />
        <input
          type="number"
          placeholder="area de construccion"
          ref={areasizeRef}
        />{" "}
        <br />
        <input type="checkbox" placeholder="" ref={hasacRef} />
        aire acondicionado?
        <br />
        <input
          type="number"
          placeholder="anio construccion"
          ref={yearbuiltRef}
        />
        <br />
        <input
          type="number"
          placeholder="precio de renta"
          ref={rentpriceRef}
        />{" "}
        <br />
        <input
          type="date"
          placeholder="fecha disponible"
          ref={dateavaliableRef}
        />
        <br />
        <br />
        <button onClick={handleCreateFlats}> Registrar Propiedad</button>
      </div>
      <ul>
        {flats.map((flat, index) => (
          <li key={index}>{flat.name}</li>
        ))}
      </ul>
    </>
  );
}
/*const NewFlatPage = () => {
  // Contenido del componente
  return (
    <>
      <div>
        <h1>NewFlatPage</h1>
      </div>
    </>
  );
};
*/
export default NewFlatPage;
