/*
import React, { useEffect, useState } from "react";
import { createUser, getUsers } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Validación personalizada para verificar que el usuario sea mayor de 18 años
const isAdult = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Verificar si el mes o día actual es antes del mes o día de cumpleaños
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
};

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("El nombre es requerido"),
  lastname: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("Ingrese un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  birthdate: Yup.date()
    .required("La fecha de nacimiento es requerida")
    .test(
      "is-adult",
      "Debes tener al menos 18 años para registrarte",
      (value) => isAdult(value)
    ),
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
    ),
});

function NewUser() {
  const [users, setUsers] = useState([]);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    birthdate: "",
    password: "",
  };

  const handleCreateUsers = async (values, { setSubmitting }) => {
    try {
      // Verificar si el email ya existe
      const userExists = users.some((user) => user.email === values.email);
      if (userExists) {
        setEmailExists(true);
        setSubmitting(false);
        return;
      }

      // Si el email no existe, crear el usuario
      await createUser(values);
      await fetchData();
      alert("Usuario Creado con exito.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error al crear la cuenta. Por favor, intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    const usersData = await getUsers(); // Consultar todos los usuarios
    setUsers(usersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para verificar si el email ya existe mientras se escribe
  const checkEmailExists = (email) => {
    const userExists = users.some((user) => user.email === email);
    setEmailExists(userExists);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleCreateUsers}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <Field type="text" name="firstname" placeholder="Ingrese su nombre" />
          {errors.firstname && touched.firstname ? (
            <div>{errors.firstname}</div>
          ) : null}

          <Field
            type="text"
            name="lastname"
            placeholder="Ingrese su apellido"
          />
          {errors.lastname && touched.lastname ? (
            <div>{errors.lastname}</div>
          ) : null}

          <Field
            type="email"
            name="email"
            placeholder="Ingrese su correo electrónico"
            onChange={(e) => {
              setFieldValue("email", e.target.value);
              checkEmailExists(e.target.value); // Verificar si el email ya existe en tiempo real
            }}
          />
          {emailExists && (
            <div style={{ color: "red" }}>
              Ya existe una cuenta con este correo.
            </div>
          )}
          {errors.email && touched.email ? <div>{errors.email}</div> : null}

          <Field
            type="date"
            name="birthdate"
            placeholder="Ingrese su fecha de nacimiento"
          />
          {errors.birthdate && touched.birthdate ? (
            <div>{errors.birthdate}</div>
          ) : null}

          <Field
            type="password"
            name="password"
            placeholder="Ingrese su contraseña"
          />
          {errors.password && touched.password ? (
            <div>{errors.password}</div>
          ) : null}

          <button type="submit" disabled={emailExists}>
            Crear cuenta
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default NewUser;
*/
import React, { useEffect, useState } from "react";
import { createUser, getUsers } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Validación personalizada para verificar que el usuario sea mayor de 18 años
const isAdult = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
};

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("El nombre es requerido"),
  lastname: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("Ingrese un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  birthdate: Yup.date()
    .required("La fecha de nacimiento es requerida")
    .test(
      "is-adult",
      "Debes tener al menos 18 años para registrarte",
      (value) => isAdult(value)
    ),
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
    ),
});

function NewUser() {
  const [users, setUsers] = useState([]);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    birthdate: "",
    password: "",
  };

  const handleCreateUsers = async (values, { setSubmitting }) => {
    try {
      const userExists = users.some((user) => user.email === values.email);
      if (userExists) {
        setEmailExists(true);
        setSubmitting(false);
        return;
      }

      await createUser(values);
      await fetchData();
      alert("Usuario creado con éxito.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error al crear la cuenta. Por favor, intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const checkEmailExists = (email) => {
    const userExists = users.some((user) => user.email === email);
    setEmailExists(userExists);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleCreateUsers}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Field
              type="text"
              name="firstname"
              placeholder="Ingrese su nombre"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.firstname && touched.firstname && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.firstname}
              </div>
            )}

            <Field
              type="text"
              name="lastname"
              placeholder="Ingrese su apellido"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.lastname && touched.lastname && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.lastname}
              </div>
            )}

            <Field
              type="email"
              name="email"
              placeholder="Ingrese su correo electrónico"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              onChange={(e) => {
                setFieldValue("email", e.target.value);
                checkEmailExists(e.target.value);
              }}
            />
            {emailExists && (
              <div style={{ color: "red", fontSize: "12px" }}>
                Ya existe una cuenta con este correo.
              </div>
            )}
            {errors.email && touched.email && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.email}
              </div>
            )}

            <Field
              type="date"
              name="birthdate"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.birthdate && touched.birthdate && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.birthdate}
              </div>
            )}

            <Field
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.password && touched.password && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.password}
              </div>
            )}

            <button
              type="submit"
              disabled={emailExists}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: emailExists ? "#cccccc" : "#5e17a9",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: emailExists ? "not-allowed" : "pointer",
                marginTop: "20px",
              }}
            >
              Crear cuenta
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default NewUser;
