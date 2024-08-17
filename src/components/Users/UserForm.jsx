//Componente para registrar el usuario o para actualizar el perfil

import { useEffect, useRef, useState } from "react";
import { createUser, getUsers } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

function NewUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const birthdateRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const fetchData = async () => {
    const flats = await getUsers();
    setUsers(flats);
  };

  const handleCreateUsers = async () => {
    await createUser({
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      birthdate: birthdateRef.current.value,
      password: passwordRef.current.value,
    });
    await fetchData();
    navigate("/login");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h3> Ingrese su nombre:</h3>
        <input type="text" placeholder="Ingrese su nombre" ref={firstnameRef} />
        <br />

        <h3> Ingrese su apellido:</h3>
        <input
          type="text"
          placeholder="Ingrese su apellido"
          ref={lastnameRef}
        />
        <br />

        <h3> email:</h3>
        <input type="text" placeholder="Ingrese su email" ref={emailRef} />
        <br />

        <h3> Fecha de nacimiento :</h3>
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          ref={birthdateRef}
        />

        <br />

        <h3> password:</h3>
        <input
          type="text"
          placeholder="Ingrese su password"
          ref={passwordRef}
        />
        <br />

        <button onClick={handleCreateUsers}>Crear cuenta</button>
      </div>
    </>
  );
}

export default NewUser;
