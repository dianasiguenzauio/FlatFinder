import Footer from "../components/Commons/Footer";
import HeaderContainer from "../components/Commons/Header";
import EditUsers from "../components/Users/EditUsersForm";

function HomePage() {
  return (
    <>
      <div>
        <HeaderContainer></HeaderContainer>
        <EditUsers> </EditUsers>
        <Footer></Footer>
      </div>
    </>
  );
}
export default HomePage;
