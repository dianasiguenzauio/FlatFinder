import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    firstname: null,
    isAdmin: false,
  });

  const login = (data) => {
    setAuth({
      token: data.token,
      firstname: data.firstname,
      isAdmin: data.isAdmin,
    });
  };

  const logout = () => {
    setAuth({
      token: null,
      firstname: null,
      isAdmin: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
