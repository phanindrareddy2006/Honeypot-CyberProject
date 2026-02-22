import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: "", msg: "" });
    const navigate = useNavigate();

    const checks = {
        length: password.length >= 8,
        caps: /[A-Z]/.test(password),
        num: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const passedCount = Object.values(checks).filter(Boolean).length;
    const strengthPercent = (passedCount / 4) * 100;
    const strengthLabel =
        passedCount === 0
            ? ""
            : passedCount <= 1
                ? "Weak"
                : passedCount <= 2
                    ? "Fair"
                    : passedCount <= 3
                        ? "Good"
                        : "Strong";
    const strengthColor =
        passedCount <= 1
            ? "var(--danger)"
            : passedCount <= 2
                ? "var(--warning)"
                : passedCount <= 3
                    ? "#3b82f6"
                    : "var(--success)";

    const allValid = Object.values(checks).every(Boolean) && username.trim().length > 0;

    const showToast = (type, msg) => {
        setToast({ show: true, type, msg });
        setTimeout(() => setToast({ show: false, type: "", msg: "" }), 4000);
    };

    const signup = async () => {
        if (!allValid) return;
        setLoading(true);

        try {
            const res = await fetch(`https://honeypot-cyberproject.onrender.com/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                showToast("success", "Account created successfully! Redirecting...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                const text = await res.text();
                showToast("error", text || "Signup failed. Try a different username.");
            }
        } catch (err) {
            showToast("error", "Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const constraints = [
        { key: "length", label: "Minimum 8 characters" },
        { key: "caps", label: "One uppercase letter" },
        { key: "num", label: "One number" },
        { key: "special", label: "One special character (!@#$...)" },
    ];

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Create Account</h2>
                    <p>Join ShopEasy and start shopping today</p>
                </div>

                <div className="signup-form">
                    <div className="input-group">
                        <label htmlFor="signup-username">Username</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="signup-username"
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="signup-password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    {/* Password Strength Bar */}
                    {password.length > 0 && (
                        <div className="strength-section">
                            <div className="strength-bar-track">
                                <div
                                    className="strength-bar-fill"
                                    style={{
                                        width: `${strengthPercent}%`,
                                        background: strengthColor,
                                    }}
                                ></div>
                            </div>
                            <span className="strength-label" style={{ color: strengthColor }}>
                                {strengthLabel}
                            </span>
                        </div>
                    )}

                    {/* Constraint Checklist */}
                    <div className="constraints-list">
                        {constraints.map((c) => (
                            <div
                                key={c.key}
                                className={`constraint ${checks[c.key] ? "valid" : "invalid"}`}
                            >
                                <span className="constraint-icon">
                                    {checks[c.key] ? "✓" : "✗"}
                                </span>
                                <span className="constraint-text">{c.label}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className={`signup-btn ${allValid ? "active" : "disabled"}`}
                        onClick={signup}
                        disabled={!allValid || loading}
                    >
                        {loading ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <p className="signup-footer">
                        Already have an account?{" "}
                        <Link to="/login" className="link-accent">
                            Log in
                        </Link>
                    </p>
                </div>

                {/* Toast */}
                {toast.show && (
                    <div className={`toast toast-${toast.type}`}>
                        <span className="toast-icon">
                            {toast.type === "success" ? "✓" : "✗"}
                        </span>
                        {toast.msg}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Signup;