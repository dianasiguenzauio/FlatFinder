import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  textFieldClasses,
} from "@mui/material";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Estado para controlar el diálogo

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .matches(
        /^[a-zA-Z]{1,20}$/,
        "Debe tener entre 1 y 20 caracteres, solo letras."
      )
      .required("El nombre es obligatorio."),
    lastname: Yup.string()
      .matches(
        /^[a-zA-Z]{1,20}$/,
        "Debe tener entre 1 y 20 caracteres, solo letras."
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
          return response.status === 200; // El correo está disponible
        } catch (error) {
          return false; // El correo ya está registrado
        }
      }),
    password: Yup.string()
      .min(8, "Debe tener al menos 8 caracteres.")
      .matches(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
      .matches(/[a-z]/, "Debe incluir al menos una letra minúscula.")
      .matches(/\d/, "Debe incluir al menos un número.")
      .matches(/[@$!%*?&.]/, "Debe incluir al menos un carácter especial.")
      .required("La contraseña es obligatoria."),
    birthdate: Yup.date()
      .required("La fecha de nacimiento es obligatoria.")
      .test("age", "Debes tener al menos 18 años.", (value) => {
        const birthdate = new Date(value);
        const age = new Date().getFullYear() - birthdate.getFullYear();
        return age >= 18;
      }),
  });

  // Valores iniciales del formulario
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    birthdate: "",
  };

  // Manejador del envío del formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Realizar la solicitud al servicio
      const response = await axios.post(
        "http://localhost:8080/users/register",
        values
      );
      console.log("Respuesta del servidor:", response.data);

      // Mostrar el diálogo de éxito
      setOpen(true);
      resetForm();
    } catch (error) {
      console.error("Error al registrar:", error);
      alert(error.response?.data?.message || "Error al procesar el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  // Manejador para cerrar el diálogo y redirigir
  const handleDialogClose = () => {
    setOpen(false);
    navigate("/login"); // Redirigir a la ruta de inicio de sesión
  };

  const formStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
    textAlign: "center",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    height: window.innerWidth <= 768 ? "100vh" : "auto",
    width: window.innerWidth <= 768 ? "50%" : "100%",
    marginTop: window.innerWidth <= 768 ? "6rem" : "11rem",
    marginBottom: window.innerWidth <= 768 ? "2rem" : "4rem",
  };

  const divStyle = {
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    marginTop: "11rem",
    marginBottom: "4rem",
  };
  const inputRegister = {
    width: "350px",
    padding: "10px",
    color: "black",
    backgroundColor: "#e6fafe",
    border: "3px solid #690dab",
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

  return (
    <div style={divStyle}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form style={formStyle}>
            <div>
              <h1
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  color: "#001f3d",
                }}
              >
                Registrar Nuevo Usuario
              </h1>
              <Field
                type="text"
                name="firstname"
                style={inputRegister}
                placeholder="Ingresa tu nombre"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderWidth: "2px", // Grosor del borde
                      borderColor: "purple", // Color del borde
                    },
                    "&:hover fieldset": {
                      borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "purple", // Color del borde cuando está enfocado
                    },
                  },
                }}
              />
              <ErrorMessage
                name="firstname"
                component="p"
                style={{ color: "red" }}
                className="inputRegister"
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
              <label>Fecha de Nacimiento </label>
              <Field type="date" name="birthdate" />
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
              {isSubmitting ? "Enviando..." : "Crear Cuenta"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Diálogo de éxito */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Registro Exitoso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¡Tu cuenta ha sido creada con éxito! Ahora puedes iniciar sesión.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;
