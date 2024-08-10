//Pagina para crear un nuevo flat
import Alert from "@mui/material/Alert";
import { useEffect, useRef, useState } from "react";
import { createFlats, getFlats } from "../services/firebase";

function NewFlatPage() {
  const [flats, setFlats] = useState([]);
  const [cityError, setCityError] = useState("");
  const [streetnameError, setStreetnameError] = useState("");
  const [streetnumberError, setStreetnumberError] = useState("");
  const [areasizeError, setAreasizeError] = useState("");
  const [yearbuiltError, setYearbuiltError] = useState("");
  const [rentpriceError, setRentpriceError] = useState("");

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
    let valid = true;

    if (isNaN(Number(streetnumberRef.current.value))) {
      setStreetnumberError("Solo se permite ingresar números.");
      valid = false;
    }

    if (isNaN(Number(areasizeRef.current.value))) {
      setAreasizeError("Solo se permite ingresar números.");
      valid = false;
    }

    if (isNaN(Number(yearbuiltRef.current.value))) {
      setYearbuiltError("Solo se permite ingresar números.");
      valid = false;
    }

    if (isNaN(Number(rentpriceRef.current.value))) {
      setRentpriceError("Solo se permite ingresar números.");
      valid = false;
    }

    if (!valid) return;

    await createFlats({
      city: cityRef.current.value,
      streetname: streetnameRef.current.value,
      streetnumber: Number(streetnumberRef.current.value),
      areasize: Number(areasizeRef.current.value),
      hasac: hasacRef.current.checked,
      yearbuilt: Number(yearbuiltRef.current.value),
      rentprice: Number(rentpriceRef.current.value),
      dateavaliable: dateavaliableRef.current.value,
    });
    await fetchData();
  };

  const handleTextChange = (e, setError) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(e.target.value)) {
      setError("Solo se permite ingresar texto.");
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    } else {
      setError("");
    }
  };

  const handleNumberChange = (e, setError) => {
    const regex = /^[0-9\b]+$/;
    if (!regex.test(e.target.value)) {
      setError("Solo se permite ingresar números.");
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>Propiedad</h1>
      <div>
        <h3> Ingrese la ciudad:</h3>
        <input
          type="text"
          placeholder="ciudad"
          ref={cityRef}
          onChange={(e) => handleTextChange(e, setCityError)}
        />
        <br />
        {cityError && <p style={{ color: "red" }}>{cityError}</p>}
        <h3> Ingrese la Calle :</h3>
        <input
          type="text"
          placeholder="Calle"
          ref={streetnameRef}
          onChange={(e) => handleTextChange(e, setStreetnameError)}
        />
        <br />
        {streetnameError && <p style={{ color: "red" }}>{streetnameError}</p>}
        <h3> Ingrese la numeracion :</h3>
        <input
          type="text"
          placeholder="numeracion"
          ref={streetnumberRef}
          onInput={(e) => handleNumberChange(e, setStreetnumberError)}
        />
        <br />
        {streetnumberError && (
          <p style={{ color: "red" }}>{streetnumberError}</p>
        )}
        <h3> Ingrese area de construccion :</h3>
        <input
          type="text"
          placeholder="area de construccion"
          ref={areasizeRef}
          onInput={(e) => handleNumberChange(e, setAreasizeError)}
        />
        <br />
        {areasizeError && <p style={{ color: "red" }}>{areasizeError}</p>}
        <input type="checkbox" ref={hasacRef} /> aire acondicionado?
        <br />
        <h3> Ingrese año de construccion :</h3>
        <input
          type="text"
          placeholder="año construccion"
          ref={yearbuiltRef}
          onInput={(e) => handleNumberChange(e, setYearbuiltError)}
        />
        <br />
        {yearbuiltError && <p style={{ color: "red" }}>{yearbuiltError}</p>}
        <h3> Ingrese precio de renta :</h3>
        <input
          type="text"
          placeholder="precio de renta"
          ref={rentpriceRef}
          onInput={(e) => handleNumberChange(e, setRentpriceError)}
        />
        <br />
        {rentpriceError && <p style={{ color: "red" }}>{rentpriceError}</p>}
        <h3> Fecha de disponibilidad :</h3>
        <input
          type="date"
          placeholder="fecha disponible"
          ref={dateavaliableRef}
        />
        <br />
        <br />
        <button onClick={handleCreateFlats}>Registrar Propiedad </button>
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
