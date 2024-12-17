import LoginForm from "../components/Users/LoginForm";
import NavbarContainer from "../components/Commons/Navbar";
import Footer from "../components/Commons/Footer";

const LoginPage = () => {
  // Aquí puedes enviar los datos a un servidor para crear la cuenta
  // Simularemos que la cuenta se creó exitosamente

  return (
    <>
      <div>
        <NavbarContainer></NavbarContainer>

        <LoginForm />
        <Footer></Footer>
      </div>
    </>
  );
};

export default LoginPage;
