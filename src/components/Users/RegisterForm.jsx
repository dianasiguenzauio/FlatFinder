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

  return (
    <div>
      <h2>Formulario de Registro</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Nombre:</label>
              <Field type="text" name="firstname" />
              <ErrorMessage
                name="firstname"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <label>Apellido:</label>
              <Field type="text" name="lastname" />
              <ErrorMessage
                name="lastname"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <label>Correo Electrónico:</label>
              <Field type="email" name="email" />
              <ErrorMessage
                name="email"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <label>Contraseña:</label>
              <Field type="password" name="password" />
              <ErrorMessage
                name="password"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <label>Fecha de Nacimiento:</label>
              <Field type="date" name="birthdate" />
              <ErrorMessage
                name="birthdate"
                component="p"
                style={{ color: "red" }}
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
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
