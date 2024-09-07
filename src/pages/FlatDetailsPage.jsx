//Pagina para ver la informacion detallada de un flat

import NavbarContainer from "../components/Commons/Navbar";
import VerDetallePage from "../components/Flats/FlatItem";

function FlatDetailsPage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>Flat</h1>
        <VerDetallePage></VerDetallePage>
      </div>
    </>
  );
}
export default FlatDetailsPage;
