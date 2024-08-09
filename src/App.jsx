import react from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Commons/Navbar";
import HomePage from "./pages/HomePage";
import MyFlatsPage from "./pages/MyFlatsPage";
import NewFlatPage from "./pages/NewFlatPage";
import FavouritesPage from "./pages/FavouritesPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mis-flats" element={<MyFlatsPage />} />
        <Route path="/nuevo" element={<NewFlatPage />} />
        <Route path="/favoritos" element={<FavouritesPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
