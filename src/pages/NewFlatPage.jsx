//Pagina para ver la informacion detallada de un flat

import React from "react";
import NavbarContainer from "../components/Commons/Navbar";
import NewFlat from "../components/Flats/FlatForm";

function NewFlatPage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>NewFlatPage</h1>
      </div>
      <NewFlat>Componente NewFlat</NewFlat>
    </>
  );
}
export default NewFlatPage;
