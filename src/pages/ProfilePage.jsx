//Pagina para ver la informacion detallada de un flat

import React from "react";
import NavbarContainer from "../components/Commons/Navbar";
import ProfileView from "../components/Users/ProfileView";

function ProfilePage() {
  return (
    <>
      <div>
        <NavbarContainer />
        <h1>ProfilePage</h1>
      </div>
      <ProfileView>Componente NewFlat</ProfileView>
    </>
  );
}
export default ProfilePage;
