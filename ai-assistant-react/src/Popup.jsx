import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import SavedNotes from "./SavedNotes";

function Popup() {
    return (
        <Router>
            <div style={{ padding: "20px", width: "300px" }}>
                <nav>
                    <button><Link to="/">Home</Link></button>
                    <button><Link to="/saved">Saved Notes</Link></button>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/saved" element={<SavedNotes />} />
                </Routes>
            </div>
        </Router>
    );
}

export default Popup;
