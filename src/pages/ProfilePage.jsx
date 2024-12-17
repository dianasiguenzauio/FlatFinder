//Pagina para ver la informacion detallada de un flat

import React from "react";
import EditProfile from "../components/Users/ProfileForm";
import Header from "../components/Commons/Header";
import Footer from "../components/Commons/Footer";

function ProfilePage() {
  return (
    <>
      <div>
        <Header />

        <EditProfile> </EditProfile>
        <Footer></Footer>
      </div>
    </>
  );
}
export default ProfilePage;
