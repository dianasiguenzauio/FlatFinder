import RegisterForm from "../components/Users/RegisterForm";
import NavbarContainer from "../components/Commons/Navbar";

const RegisterPage = () => {
  // Aquí puedes enviar los datos a un servidor para crear la cuenta
  // Simularemos que la cuenta se creó exitosamente

  return (
    <>
      <div>
        <NavbarContainer></NavbarContainer>

        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
