// Navbar.jsx
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="logo">
        Home
      </a>

      <ul className="nav-links">
        <li>
          <a href="/mypost">my posts</a>
        </li>
        <li>
          <a href="/posts">posts</a>
        </li>
        <li>
          <a href="/todos">todos</a>
        </li>
        <li>
          <a href="/albums">alboums</a>
        </li>
        
      </ul>
    </nav>
  );
}
