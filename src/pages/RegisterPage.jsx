import RegisterForm from "../components/Users/RegisterForm";
import NavbarContainer from "../components/Commons/Navbar";

const RegisterPage = () => {
  // Aquí puedes enviar los datos a un servidor para crear la cuenta
  // Simularemos que la cuenta se creó exitosamente

  return (
    <>
      <div>
        <NavbarContainer></NavbarContainer>
        <h1> Nuevo Usuario </h1>
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
