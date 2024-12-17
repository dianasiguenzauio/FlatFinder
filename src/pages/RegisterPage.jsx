import RegisterForm from "../components/Users/RegisterForm";
import NavbarContainer from "../components/Commons/Navbar";
import Footer from "../components/Commons/Footer";

const RegisterPage = () => {
  // Aquí puedes enviar los datos a un servidor para crear la cuenta
  // Simularemos que la cuenta se creó exitosamente

  return (
    <>
      <div>
        <NavbarContainer></NavbarContainer>

        <RegisterForm />
        <Footer></Footer>
      </div>
    </>
  );
};

export default RegisterPage;
