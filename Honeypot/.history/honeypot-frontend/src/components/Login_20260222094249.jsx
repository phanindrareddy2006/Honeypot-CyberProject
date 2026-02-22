import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`https://honeypot-cyberproject.onrender.com/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                // Successful login
                localStorage.setItem("user", username);
                navigate("/dashboard");
            } else {
                // Failed login — honeypot logs it on the backend
                setError("Invalid username or password. Please try again.");
                setTimeout(() => setError(""), 4000);
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setTimeout(() => setError(""), 4000);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Log in to your ShopEasy account</p>
                </div>

                <div className="login-form">
                    <div className="input-group">
                        <label htmlFor="login-username">Username</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="login-username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="login-error">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <button
                        className="login-btn"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <span className="btn-spinner"></span> : "Log In"}
                    </button>

                    <p className="login-footer">
                        Don't have an account?{" "}
                        <Link to="/signup" className="link-accent">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
