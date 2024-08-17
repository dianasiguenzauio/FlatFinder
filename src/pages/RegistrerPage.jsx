import NewUser from "../components/Users/UserForm";

const RegisterPage = () => {
  // Aquí puedes enviar los datos a un servidor para crear la cuenta
  // Simularemos que la cuenta se creó exitosamente

  return (
    <>
      <div>
        <h1> Nuevo Usuario </h1>
      </div>
      <NewUser>Nuevo Usuario...</NewUser>
    </>
  );
};

export default RegisterPage;
