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
