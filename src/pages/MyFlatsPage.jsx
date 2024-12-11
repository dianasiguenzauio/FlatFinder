//Pagina para ver el listado de flats del usuario

import HeaderContainer from "../components/Commons/Header";
import FlatsOwner from "../components/Flats/MyFlatsForm";

function MyFlatsPage() {
  return (
    <>
      <div>
        <HeaderContainer />

        <FlatsOwner></FlatsOwner>
      </div>
    </>
  );
}

export default MyFlatsPage;
