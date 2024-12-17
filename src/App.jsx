import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; // Envuelve tu app con el proveedor de autenticación

import LoginPage from "./pages/LoginPage";

import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import NewFlatPage from "./pages/NewFlatPage";

import MyFlatsPage from "./pages/MyFlatsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import FlatDetailsPage from "./pages/FlatDetailsPage";
import MessagePage from "./pages/MessagePage";
import FlatListPage from "./pages/FlatListPage";
import EditUsersPage from "./pages/EditUsersPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/start" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/FlatDetailsPage/:flatId" element={<FlatDetailsPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/FlatsList" element={<FlatListPage />} />
          <Route path="/MyFlats" element={<MyFlatsPage />} />
          <Route path="/NewFlatPage" element={<NewFlatPage />} />
          <Route path="/Edit-Users" element={<EditUsersPage />} />
          <Route path="/MyProfile" element={<ProfilePage />} />
          <Route path="/Messages" element={<MessagePage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
