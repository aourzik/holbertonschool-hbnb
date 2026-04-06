import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Places from "./pages/Places";
import SelectedPlace from "./pages/SelectedPlace";


function App() {
  return (
    <Router>
      <Navbar />

      {/* Le "Switch" qui choisit quelle page montrer */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
        <Route path="/estate/:id" element={<SelectedPlace />} /> {/* Page de détail d'un manoir */}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;