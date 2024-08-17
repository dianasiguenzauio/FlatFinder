//Pagina para ver el listado de flats del usuario

import NavbarContainer from "../components/Commons/Navbar";
import FlatList from "../components/Flats/FlatList";

function MyFlatsPage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>MyFlatsPage</h1>
      </div>
      <FlatList>Flatlist</FlatList>
    </>
  );
}

export default MyFlatsPage;
