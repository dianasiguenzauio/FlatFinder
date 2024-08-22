import React, { useEffect, useState } from "react";
import { createUser, getUsers } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("El nombre es requerido"),
  lastname: Yup.string().required("El apellido es requerido"),
  email: Yup.string()

    .email("Ingrese un correo electrónico válido")
    .required("El correo electrónico es requerido"),

  birthdate: Yup.date().required("La fecha de nacimiento es requerida"),
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
      await createUser(values);
      await fetchData();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error al crear la cuenta. Por favor, intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    const flats = await getUsers(); // Consider changing 'flats' to a more descriptive name
    setUsers(flats);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleCreateUsers}
    >
      {({ errors, touched }) => (
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
          />
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

          <button type="submit">Crear cuenta</button>
        </Form>
      )}
    </Formik>
  );
}

export default NewUser;
