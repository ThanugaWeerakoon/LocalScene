import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './index.css';
import Artists from "./pages/Artists";
import Gigs from "./pages/Gigs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/gigs" element={<Gigs />} />
      </Routes>
    </Router>
  );
}

export default App;