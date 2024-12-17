//Pagina para ver la informacion detallada de un flat

import Footer from "../components/Commons/Footer";
import NavbarContainer from "../components/Commons/Navbar";

function FlatDetailsPage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>Flat</h1>
        <VerDetallePage></VerDetallePage>
        <Footer></Footer>
      </div>
    </>
  );
}
export default FlatDetailsPage;
