import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const Navbar = () => {
     const {theme,toggleTheme} = useTheme();

    return (
        <nav className="nav-items">
          <div >
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>

          </div>

          <div className="mode-switch">
            <label>
                <input
                 type="checkbox"
                 onChange={toggleTheme}
                 checked={theme === "dark"}
                
                />
            </label>
          </div>
        </nav>

    );

}

export default Navbar;