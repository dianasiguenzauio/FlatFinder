import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProtectedPage from "./pages/ProtectedPage";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import NewFlatPage from "./pages/NewFlatPage";
import FavouritesPage from "./pages/FavouritesPage";
import MyFlatsPage from "./pages/MyFlatsPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrerPage from "./pages/RegistrerPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/NewFlatPage" element={<NewFlatPage />} />
      <Route path="/FavouritesPage" element={<FavouritesPage />} />
      <Route path="/MyFlatsPage" element={<MyFlatsPage />} />
      <Route path="/ProfilePage" element={<ProfilePage />} />
      <Route path="/RegistrerPage" element={<RegistrerPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
