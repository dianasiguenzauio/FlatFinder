//Este estado se va a encargar de manejar nuestro user a nivel global
//Van un estado donde puedan guardar el usuario y una funcion para setear el usuario

//Sirve para manejar el estado de autenticación de manera global
import { createContext, useState, useEffect } from "react";
import {
  getToken,
  isAuthenticaded,
  removeToken,
  setToken,
} from "../services/authService";
import { db } from ".././config/firebase";
import { query, where, getDocs, collection } from "firebase/firestore";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(isAuthenticaded());
  const [user, setUser] = useState(JSON.parse(getToken()));

  useEffect(() => {
    const fetchUserData = async () => {
      const tokenData = JSON.parse(getToken());
      if (tokenData && tokenData.email) {
        try {
          const q = query(
            collection(db, "users"),
            where("email", "==", tokenData.email)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUser({
              email: tokenData.email,
              firstname: userDoc.data().firstname,
            });
          } else {
            console.error("No se encontró el documento del usuario");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    if (auth) {
      fetchUserData();
    }
  }, [auth]);

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
    user,
  };

  return (
    <AuthContext.Provider value={valueToShare}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
