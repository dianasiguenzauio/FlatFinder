//Este estado se va a encargar de manejar nuestro user a nivel global
//Van un estado donde puedan guardar el usuario y una funcion para setear el usuario

//Sirve para manejar el estado de autenticación de manera global
import { createContext, useState } from "react";
import {
  isAuthenticaded,
  removeToken,
  setToken,
} from "../services/authService";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = (token) => {
    setToken(token);
    setAuth(true);
  };
  const logout = () => {
    removeToken();
    setAuth(false);
  };

  const valueToShare = {
    auth,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valueToShare}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
