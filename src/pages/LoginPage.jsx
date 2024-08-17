import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = { username, password };

    //Implementar logica para obtener el usuario por username de firebase
    //bcrypt dependencia

    //....llamar a las bd de firebase
    navigate("/RegistrerPage");

    if (user.username === "admin" && user.password === "1234") {
      //hacer login
      login(JSON.stringify(user));
      alert("Ingreso exitoso");
      navigate("/");
    } else {
      alert("Usuario o contraseña incorrecta");
    }
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

      <button>Login</button>
      <button>Crear cuenta</button>
    </form>
  );
}

export default LoginPage;
