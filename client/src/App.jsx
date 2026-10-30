import { NavLink, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import Issues from "./pages/Issues.jsx";
import Report from "./pages/Report.jsx";

export default function App() {
  return (
    <>
      <p className="sample-tag">Module 5 · MERN · UI → Express → MongoDB</p>
      <header className="shell-header">
        <p className="eyebrow">BMSCE CSE · Full Stack · Experiment 6</p>
        <h1>GreenCampus Reporter</h1>
        <p>React calls /api/issues. Express writes MongoDB. Refresh keeps the list.</p>
      </header>
      <nav className="sample-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/issues" className={({ isActive }) => (isActive ? "active" : "")}>
          Issues
        </NavLink>
        <NavLink to="/report" className={({ isActive }) => (isActive ? "active" : "")}>
          Report
        </NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </>
  );
}
