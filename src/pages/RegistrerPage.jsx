import NewUser from "../components/Users/UserForm";

const RegistrerPage = () => {
  // Aquí puedes enviar los datos a un servidor para crear la cuenta
  // Simularemos que la cuenta se creó exitosamente

  return (
    <>
      <div>
        <h1> Crea una cuenta </h1>
      </div>
      <NewUser>Nuevo Usuario...</NewUser>
    </>
  );
};

export default RegistrerPage;
