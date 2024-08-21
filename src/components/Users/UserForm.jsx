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
      const validationErrors = [];
      for (const field in values) {
        if (!values[field]) {
          validationErrors.push(`El campo ${field} es requerido.`);
        }
      }

      if (validationErrors.length > 0) {
        alert(validationErrors.join("\n"));
        return;
      }

      await createUser(values);
      await fetchData();
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    const flats = await getUsers();
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
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <Form>
          <Field type="text" name="firstname" placeholder="Ingrese su nombre" />
          <ErrorMessage name="firstname" component="div" />

          <Field
            type="text"
            name="lastname"
            placeholder="Ingrese su apellido"
          />
          <ErrorMessage name="lastname" component="div" />

          <Field type="email" name="email" placeholder="Ingrese su email" />
          <ErrorMessage name="email" component="div" />

          <Field
            type="date"
            name="birthdate"
            placeholder="Ingrese su fecha de nacimiento"
          />
          <ErrorMessage name="birthdate" component="div" />

          <Field
            type="password"
            name="password"
            placeholder="Ingrese su contraseña"
          />
          <ErrorMessage name="password" component="div" />

          <button type="submit">Crear cuenta</button>
        </Form>
      )}
    </Formik>
  );
}

export default NewUser;
