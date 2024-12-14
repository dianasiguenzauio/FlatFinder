import { useContext } from "react";

import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/authContext";

function PrivateRoute({}) {
  const { auth } = useContext(AuthContext);
  console.log(JSON.stringify(auth));
  return auth?.token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
