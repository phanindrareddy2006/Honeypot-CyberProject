import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
    const [user, setUser] = useState(localStorage.getItem("user"));
    const navigate = useNavigate();

    // Listen for storage changes (login/logout in same tab)
    useEffect(() => {
        const sync = () => setUser(localStorage.getItem("user"));
        window.addEventListener("storage", sync);
        // Also poll for changes in the same tab
        const interval = setInterval(sync, 500);
        return () => {
            window.removeEventListener("storage", sync);
            clearInterval(interval);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <span className="logo-icon">🛒</span>
                <span className="logo-text">ShopEasy</span>
            </Link>

            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>

                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <button onClick={logout} className="nav-btn-logout">
                            Logout
                        </button>
                        <div className="nav-avatar" title={user}>
                            {user.charAt(0).toUpperCase()}
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-btn-signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;