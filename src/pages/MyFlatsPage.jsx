//Pagina para ver el listado de flats del usuario

import NavbarContainer from "../components/Commons/Navbar";
import MyFlats from "../components/Flats/FlatView";

function MyFlatsPage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>MyFlatsPage</h1>
        <MyFlats></MyFlats>
      </div>
    </>
  );
}

export default MyFlatsPage;
