// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MetsOrLeadsDetails from "./components/MetsOrLeadsDetails";
import MetsOrLeadsDetailsExcelDownload from "./components/MetsOrLeadsDetailsExcelDownload";
const App = () => {
  return (
    <Router>
      {/* Simple Navigation */}
      {/* <nav className="bg-gray-800 p-4 text-white flex gap-4">
        <Link to="/" className="hover:underline">
          Fill Form
        </Link>
        <Link to="/download" className="hover:underline">
          Download Data
        </Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<MetsOrLeadsDetails />} />
        <Route path="/download" element={<MetsOrLeadsDetailsExcelDownload />} />
      </Routes>
    </Router>
  );
};

export default App;
