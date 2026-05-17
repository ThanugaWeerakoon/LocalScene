import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './index.css';
import Artists from "./pages/Artists";
import Gigs from "./pages/Gigs";
import Venues from "./pages/Venues";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/gigs" element={<Gigs />} />
        <Route path="/venues" element={<Venues />} />
         <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;