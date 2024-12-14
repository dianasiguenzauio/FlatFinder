//Pagina para ver la informacion detallada de un flat

import React from "react";
import HeaderContainer from "../components/Commons/Header";
import NewFlat from "../components/Flats/FlatForm";

function NewFlatPage() {
  return (
    <>
      <div>
        <HeaderContainer></HeaderContainer>
      </div>

      <NewFlat>Componente NewFlat</NewFlat>
    </>
  );
}
export default NewFlatPage;
