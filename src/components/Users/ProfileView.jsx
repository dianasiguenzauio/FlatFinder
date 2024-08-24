//Componente para mostrar el perfil o datos del usuario

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/authContext"; // Assuming you have an AuthContext
import { getUserByEmail, updateUser } from "../../services/firebase"; // Assuming you have an updateUser function
import { Field } from "formik";

const ProfileView = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDb = await getUserByEmail(user.email);
      if (userDb.length > 0) {
        setUserData(userDb[0]);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdateProfile = async (updatedValues) => {
    try {
      // Update specific user fields (excluding email)
      // await updateUser(currentUser.uid, updatedValues);
      alert("Perfil actualizado exitosamente!");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el perfil. Intenta nuevamente.");
    }
  };

  return (
    <div>
      {userData && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateProfile({
              // Update only the desired fields (e.g., name, apellido, edad)
              firstname: userData.firstname,
              lastname: userData.lastname,
              birthday: userData.birthday,
              // Exclude email from update
            });
          }}
        >
          {/* Other fields for apellido and edad */}
          {userData.firstname}

          <button type="submit">Guardar cambios</button>
        </form>
      )}
    </div>
  );
};

export default ProfileView;
