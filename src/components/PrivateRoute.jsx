import { useContext } from "react";
import AuthContext from "../components/PrivateRoute";

import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const { auth } = useContext(AuthContext);
  return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
