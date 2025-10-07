import { NavLink, Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import GalleryPage from "./pages/GalleryPage";
import DetailPage from "./pages/DetailPage";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <h1>Hogwarts Directory</h1>
        <nav className="nav">
          <NavLink to="/" end>List</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/character/:key" element={<DetailPage />} />
        </Routes>
      </main>

      <footer className="foot">
        <a href="https://hp-api.onrender.com" target="_blank" rel="noreferrer">
          Data: HP-API
        </a>
      </footer>
    </div>
  );
}
