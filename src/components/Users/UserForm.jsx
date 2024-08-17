//Componente para registrar el usuario o para actualizar el perfil
/*import React, { useState } from 'react';



const UserForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState(''); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 
 = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false); 


  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para validar los datos antes de enviarlos
    // Por ejemplo, verificar que la contraseña tenga al menos 8 caracteres,
    // que coincida con la confirmación, etc.

    if (password === confirmPassword && termsAccepted) {
      onSubmit({
        name,
        lastName,
        birthDate,
        email,
        username,
        password,
      });
    } else {
      // Mostrar un mensaje de error si la validación falla
      console.error('Error: Contraseñas no coinciden o términos no aceptados.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      { Inputs para nombre, apellido, fecha de nacimiento, email, username, password, confirmPassword y checkbox para términos y condiciones }
      <button type="submit">Crear Cuenta</button>
    </form>
  );
};

export default UserForm;
*/

//Pagina para crear un nuevo flat
import { useEffect, useRef, useState } from "react";
import { createUser, getUsers } from "../../services/firebase";

function NewUser() {
  const [users, setUsers] = useState([]);

  /*const [firstname, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [birthdate, setBirthDate] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  */

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
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>Propiedad</h1>
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
      <ul>
        {users.map((flat, index) => (
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
export default NewUser;
