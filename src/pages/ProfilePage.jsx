//Pagina para ver la informacion detallada de un flat

import React from "react";
import NavbarContainer from "../components/Commons/Navbar";
import ProfileView from "../components/Users/ProfileView";
import UserProfile from "../components/Users/ProfileView";

function ProfilePage() {
  return (
    <>
      <div>
        <NavbarContainer />

        <UserProfile> </UserProfile>
      </div>
    </>
  );
}
export default ProfilePage;
