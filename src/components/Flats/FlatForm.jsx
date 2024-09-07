//Componente para crear
/*
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFlats, getFlats } from "../../services/firebase";

function NewFlat() {
  const [flats, setFlats] = useState([]);
  const [cityError, setCityError] = useState("");
  const [streetnameError, setStreetnameError] = useState("");
  const [streetnumberError, setStreetnumberError] = useState("");
  const [areasizeError, setAreasizeError] = useState("");
  const [yearbuiltError, setYearbuiltError] = useState("");
  const [rentpriceError, setRentpriceError] = useState("");
  const [emptyFieldsError, setEmptyFieldsError] = useState("");

  const cityRef = useRef();
  const streetnameRef = useRef();
  const streetnumberRef = useRef();
  const areasizeRef = useRef();
  const hasacRef = useRef();
  const yearbuiltRef = useRef();
  const rentpriceRef = useRef();
  const dateavaliableRef = useRef();

  const navigate = useNavigate();

  const fetchData = async () => {
    const flats = await getFlats();
    setFlats(flats);
  };

  const handleCreateFlats = async () => {
    const storedUser = JSON.parse(localStorage.getItem("authToken"));
    if (!storedUser) {
      console.error("El usuario no está logueado");
      return;
    }
    // Verificar si el usuario está logueado
    if (!storedUser || !storedUser.email) {
      console.error(
        "El usuario no está logueado o falta información del usuario"
      );
      alert("No estás logueado. Por favor, inicia sesión para continuar.");
      navigate("/"); // Redirigir a la página de login
      return;
    }

    const { email } = storedUser;
    let valid = true;

    // Validación de campos vacíos
    if (
      !cityRef.current.value ||
      !streetnameRef.current.value ||
      !streetnumberRef.current.value ||
      !areasizeRef.current.value ||
      !yearbuiltRef.current.value ||
      !rentpriceRef.current.value ||
      !dateavaliableRef.current.value
    ) {
      setEmptyFieldsError("Por favor, complete todos los campos.");
      valid = false;
    } else {
      setEmptyFieldsError(""); // Limpiar el mensaje de error si no hay campos vacíos
    }

    // Validación de números
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
      userEmail: email,
    });
    await fetchData();
    alert("Propiedad Registrada con exito");
    navigate("/");
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
      <h2>Propiedad</h2>
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
        <br />
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
        {emptyFieldsError && <p style={{ color: "red" }}>{emptyFieldsError}</p>}
        <br />
        <button onClick={handleCreateFlats}>Registrar Propiedad</button>
      </div>
    </>
  );
}

export default NewFlat;
*/

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFlats, getFlats } from "../../services/firebase";

function NewFlat() {
  const [flats, setFlats] = useState([]);
  const [cityError, setCityError] = useState("");
  const [streetnameError, setStreetnameError] = useState("");
  const [streetnumberError, setStreetnumberError] = useState("");
  const [areasizeError, setAreasizeError] = useState("");
  const [yearbuiltError, setYearbuiltError] = useState("");
  const [rentpriceError, setRentpriceError] = useState("");
  const [emptyFieldsError, setEmptyFieldsError] = useState("");

  const cityRef = useRef();
  const streetnameRef = useRef();
  const streetnumberRef = useRef();
  const areasizeRef = useRef();
  const hasacRef = useRef();
  const yearbuiltRef = useRef();
  const rentpriceRef = useRef();
  const dateavaliableRef = useRef();

  const navigate = useNavigate();

  const fetchData = async () => {
    const flats = await getFlats();
    setFlats(flats);
  };

  const handleCreateFlats = async () => {
    const storedUser = JSON.parse(localStorage.getItem("authToken"));
    if (!storedUser) {
      console.error("El usuario no está logueado");
      return;
    }

    if (!storedUser || !storedUser.email) {
      console.error(
        "El usuario no está logueado o falta información del usuario"
      );
      alert("No estás logueado. Por favor, inicia sesión para continuar.");
      navigate("/"); // Redirigir a la página de login
      return;
    }

    const { email } = storedUser;
    let valid = true;

    if (
      !cityRef.current.value ||
      !streetnameRef.current.value ||
      !streetnumberRef.current.value ||
      !areasizeRef.current.value ||
      !yearbuiltRef.current.value ||
      !rentpriceRef.current.value ||
      !dateavaliableRef.current.value
    ) {
      setEmptyFieldsError("Por favor, complete todos los campos.");
      valid = false;
    } else {
      setEmptyFieldsError("");
    }

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
      userEmail: email,
    });
    await fetchData();
    alert("Propiedad Registrada con éxito");
    navigate("/");
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        overflow: "hidden", // Asegura que no haya desplazamiento
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Registrar Propiedad</h2>

        <div style={{ marginBottom: "15px" }}>
          <label>Ingrese la ciudad:</label>
          <input
            type="text"
            placeholder="Ciudad"
            ref={cityRef}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onChange={(e) => handleTextChange(e, setCityError)}
          />
          {cityError && <p style={{ color: "red" }}>{cityError}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Ingrese la calle:</label>
          <input
            type="text"
            placeholder="Calle"
            ref={streetnameRef}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onChange={(e) => handleTextChange(e, setStreetnameError)}
          />
          {streetnameError && <p style={{ color: "red" }}>{streetnameError}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Ingrese la numeración:</label>
          <input
            type="text"
            placeholder="Numeración"
            ref={streetnumberRef}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onInput={(e) => handleNumberChange(e, setStreetnumberError)}
          />
          {streetnumberError && (
            <p style={{ color: "red" }}>{streetnumberError}</p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Ingrese el área de construcción (m²):</label>
          <input
            type="text"
            placeholder="Área de construcción"
            ref={areasizeRef}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onInput={(e) => handleNumberChange(e, setAreasizeError)}
          />
          {areasizeError && <p style={{ color: "red" }}>{areasizeError}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Aire acondicionado:</label>
          <input
            type="checkbox"
            ref={hasacRef}
            style={{ marginLeft: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Ingrese el año de construcción:</label>
          <input
            type="text"
            placeholder="Año de construcción"
            ref={yearbuiltRef}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onInput={(e) => handleNumberChange(e, setYearbuiltError)}
          />
          {yearbuiltError && <p style={{ color: "red" }}>{yearbuiltError}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Ingrese el precio de renta:</label>
          <input
            type="text"
            placeholder="Precio de renta"
            ref={rentpriceRef}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onInput={(e) => handleNumberChange(e, setRentpriceError)}
          />
          {rentpriceError && <p style={{ color: "red" }}>{rentpriceError}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Fecha de disponibilidad:</label>
          <input
            type="date"
            ref={dateavaliableRef}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {emptyFieldsError && (
            <p style={{ color: "red" }}>{emptyFieldsError}</p>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleCreateFlats}
            style={{
              padding: "10px 20px",
              backgroundColor: "#5e17a9",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Registrar Propiedad
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewFlat;
