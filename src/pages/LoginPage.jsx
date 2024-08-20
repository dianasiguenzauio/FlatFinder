import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Login from "../components/Users/LoginForm";

function LoginPage() {
  return (
    <>
      <div>
        <Login> </Login>
      </div>
    </>
  );
}
export default LoginPage;
