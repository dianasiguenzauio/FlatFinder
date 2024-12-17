//Pagina para ver el listado de flats del usuario

import Footer from "../components/Commons/Footer";
import HeaderContainer from "../components/Commons/Header";
import FlatsOwner from "../components/Flats/MyFlatsForm";

function MyFlatsPage() {
  return (
    <>
      <div>
        <HeaderContainer />

        <FlatsOwner></FlatsOwner>
        <Footer></Footer>
      </div>
    </>
  );
}

export default MyFlatsPage;
