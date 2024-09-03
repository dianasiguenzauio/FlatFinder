//Pagina para ver el listado de flats del usuario

import NavbarContainer from "../components/Commons/Navbar";
import MyFlats from "../components/Flats/FlatView";

function MyFlatsPage() {
  return (
    <>
      <div>
        <NavbarContainer />

        <MyFlats></MyFlats>
      </div>
    </>
  );
}

export default MyFlatsPage;
