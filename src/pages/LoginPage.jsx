import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../services/firebase";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Para iniciar sesión por favor ingresa los datos solicitados");
      return; // En caso de no ingresar usuario y contraseña
    }

    const user = await getUserByEmail(username);
    console.log(user);

    if (user[0].password === password) {
      //hacer login
      login(JSON.stringify(user));
      alert("Ingreso exitoso");
      navigate("/");
    } else {
      alert("Usuario o contraseña incorrecta");
    }
  };

  const handleUserForm = () => {
    navigate("/RegistrerPage");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
      />

      <button type="submit">Login</button>
      <button onClick={handleUserForm}>Crear cuenta</button>
    </form>
  );
}

export default LoginPage;
