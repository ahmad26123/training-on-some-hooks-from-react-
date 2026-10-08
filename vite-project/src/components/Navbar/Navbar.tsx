// Navbar.jsx
import { Link } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Home
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/mypost">my posts</Link>
        </li>
        <li>
          <Link to="/posts">posts</Link>
        </li>
        <li>
          <Link to="/albums">alboums</Link>
        </li>
        <li>
          <Link to="/todos">todos</Link>
        </li>
      </ul>
    </nav>
  );
}
