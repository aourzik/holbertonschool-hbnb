import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Places from "./pages/Places";

function App() {
  return (
    <Router>
      <Navbar />

      {/* Le "Switch" qui choisit quelle page montrer */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;