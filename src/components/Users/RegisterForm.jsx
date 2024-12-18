import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

const RegistrationForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .matches(
        /^[a-zA-Z]{2,20}$/,
        "Debe tener entre 2 y 20 caracteres, solo letras."
      )
      .required("El nombre es obligatorio."),
    lastname: Yup.string()
      .matches(
        /^[a-zA-Z]{2,20}$/,
        "Debe tener entre 2 y 20 caracteres, solo letras."
      )
      .required("El apellido es obligatorio."),
    email: Yup.string()
      .email("Formato de correo inválido.")
      .required("El correo es obligatorio.")
      .test("checkEmail", "El correo ya está registrado.", async (value) => {
        if (!value) return false;
        try {
          const response = await axios.get(
            `http://localhost:8080/users/check-email?email=${value}`
          );
          return response.status === 200;
        } catch (error) {
          return false;
        }
      }),
    password: Yup.string()
      .min(6, "Debe tener al menos 6 caracteres.")
      .matches(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
      .matches(/[a-z]/, "Debe incluir al menos una letra minúscula.")
      .matches(/\d/, "Debe incluir al menos un número.")
      .matches(/[@$!%*?&.]/, "Debe incluir al menos un carácter especial.")
      .required("La contraseña es obligatoria."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir.")
      .required("Debe confirmar su contraseña."),
    birthdate: Yup.date()
      .required("La fecha de nacimiento es obligatoria.")
      .test("valid-age", "Debes tener entre 18 y 120 años.", (value) => {
        const birthdate = new Date(value);
        const age = new Date().getFullYear() - birthdate.getFullYear();
        return age >= 18 && age <= 120;
      }),
  });

  // Valores iniciales
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
  };

  // Manejador del envío
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Registro del usuario
      const registerResponse = await axios.post(
        "http://localhost:8080/users/register",
        values
      );

      console.log("Usuario registrado:", registerResponse.data);

      // Inicio de sesión automático
      const response = await axios.post("http://localhost:8080/users/login", {
        email: values.email,
        password: values.password,
      });

      const { token, firstname } = response.data;
      const decodedToken = jwt_decode(token);

      // Usa el contexto para manejar el login
      login({
        token,
        firstname,
        isAdmin: decodedToken.isAdmin,
      });
      // Manejo del éxito
      if (response.status === 200) {
        setDialogOpen(true); // Mostrar mensaje de bienvenida
        setTimeout(() => {
          setDialogOpen(false);
          navigate("/FlatsList"); // Redirigir a la ruta principal
        }, 2000); // Cerrar el diálogo automáticamente después de 2 segundos
      }
    } catch (error) {
      console.error("Error al procesar el registro/inicio de sesión:", error);
      alert(error.response?.data?.message || "Error al procesar el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  // Estilos personalizados
  /*const formStyle = {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
    textAlign: "center",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",
    marginTop: "2rem",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
  };*/

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "90%", // Cambiar de un tamaño fijo a relativo
    maxWidth: "600px", // Limitar ancho máximo
    margin: "2rem auto", // Centrar el formulario
  };

  const divStyle = {
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    marginTop: "12rem",
    marginBottom: "4rem",
  };

  const inputRegister = {
    width: "350px",
    padding: "10px",
    color: "black",
    backgroundColor: "#f3f3f1",
    border: "2px solid #690dab",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0px 4px 8px #00aaff)",
  };

  const buttonRegister = {
    width: "350px",
    padding: "10px",
    color: "white",
    backgroundColor: "#179fba",
    border: "3px solid #004f9e",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0px 4px 8px #00aaff)",
  };

  const datePickerStyle = {
    width: "100%", // Ocupa todo el ancho disponible
    maxWidth: "350px",
    padding: "10px",
    backgroundColor: "#f3f3f1",
    color: "#001f3d", // Texto interno
    border: "2px solid #690dab",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    fontSize: "16px",
    colorScheme: "light",
  };

  return (
    <div style={divStyle}>
      <Typography
        variant="h3"
        style={{ textAlign: "center", marginTop: "2rem", color: "#001f3d" }}
      >
        Registrar Nuevo Usuario
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form style={formStyle}>
            <div>
              <Field
                type="text"
                name="firstname"
                style={inputRegister}
                placeholder="Ingresa tu nombre"
              />
              <ErrorMessage
                name="firstname"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <Field
                type="text"
                name="lastname"
                style={inputRegister}
                placeholder="Ingresa tu apellido"
              />
              <ErrorMessage
                name="lastname"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <Field
                type="email"
                name="email"
                style={inputRegister}
                placeholder="Ingresa tu correo electrónico"
              />
              <ErrorMessage
                name="email"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <Field
                type="password"
                name="password"
                style={inputRegister}
                placeholder="Ingresa tu contraseña"
              />
              <ErrorMessage
                name="password"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <Field
                type="password"
                name="confirmPassword"
                style={inputRegister}
                placeholder="Confirma tu contraseña"
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <label>Fecha de Nacimiento </label>
              <Field type="date" name="birthdate" style={datePickerStyle} />
              <ErrorMessage
                name="birthdate"
                component="p"
                style={{ color: "red" }}
              />
            </div>
            <br />
            <button
              type="submit"
              disabled={isSubmitting}
              style={buttonRegister}
            >
              {isSubmitting ? "Procesando..." : "Crear Cuenta"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Diálogo de éxito */}
      <Dialog open={dialogOpen} onClose={setDialogOpen}>
        <DialogTitle>Registro Exitoso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¡Tu cuenta ha sido creada con éxito y has iniciado sesión!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setDialogOpen} color="primary">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;
