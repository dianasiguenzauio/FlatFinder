import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; // Envuelve tu app con el proveedor de autenticación

import LoginPage from "./pages/LoginPage";
import ProtectedPage from "./pages/ProtectedPage";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import NewFlatPage from "./pages/NewFlatPage";
import FavouritesPage from "./pages/FavouritesPage";
import MyFlatsPage from "./pages/MyFlatsPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrerPage from "./pages/RegistrerPage";
import FlatDetailsPage from "./pages/FlatDetailsPage";
import MessagePage from "./pages/MessagePage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/RegistrerPage" element={<RegistrerPage />} />

        <Route path="/NewFlatPage" element={<NewFlatPage />} />
        <Route path="/FavouritesPage" element={<FavouritesPage />} />
        <Route path="/MyFlatsPage" element={<MyFlatsPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/RegistrerPage" element={<RegistrerPage />} />
        <Route path="/MessagePage" element={<MessagePage />} />
        <Route path="/FlatDetailsPage/:flatId" element={<FlatDetailsPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
