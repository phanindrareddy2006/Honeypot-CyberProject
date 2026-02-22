import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const [logs, setLogs] = useState([]);
    const [blockedIps, setBlockedIps] = useState([]);
    const [activeTab, setActiveTab] = useState("logs"); // "logs" or "blocked"
    const [filter, setFilter] = useState("All");
    const [searchIP, setSearchIP] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Auth gate
    useEffect(() => {
        if (!localStorage.getItem("user")) {
            navigate("/login");
        }
    }, [navigate]);

    // Fetch logs & blocked IPs
    useEffect(() => {
        const fetchData = () => {
            Promise.all([
                fetch(`http://${window.location.hostname}:8642/api/attacks`).then((r) => r.json()),
                fetch(`http://${window.location.hostname}:8642/api/blocked-ips`).then((r) => r.json())
            ])
                .then(([logsData, blockedData]) => {
                    if (Array.isArray(logsData)) {
                        setLogs(logsData.reverse());
                    } else {
                        setLogs([]);
                    }

                    if (Array.isArray(blockedData)) {
                        setBlockedIps(blockedData.reverse());
                    } else {
                        setBlockedIps([]);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Compute stats
    const total = logs.length;
    const sqlCount = logs.filter((l) => l.attackType === "SQL Injection").length;
    const blockedCount = blockedIps.length;
    const bruteCount = logs.filter(
        (l) =>
            l.aiAttackType === "Suspicious Payload" ||
            l.aiAttackType === "Brute Force"
    ).length;
    const normalCount = logs.filter(
        (l) => l.attackType === "Normal" && l.aiAttackType === "Normal"
    ).length;

    // Filter logs
    const filteredLogs = logs.filter((l) => {
        const matchType =
            filter === "All" ||
            l.attackType === filter ||
            l.aiAttackType === filter;
        const matchIP = searchIP
            ? l.ip?.toLowerCase().includes(searchIP.toLowerCase())
            : true;
        return matchType && matchIP;
    });

    const filterOptions = [
        "All",
        "SQL Injection",
        "XSS Attack",
        "Suspicious Payload",
        "Normal",
    ];

    const getSeverityClass = (sev) => {
        switch (sev) {
            case "Critical": return "sev-critical";
            case "High": return "sev-high";
            case "Medium": return "sev-medium";
            default: return "sev-low";
        }
    };

    const getAttackClass = (type) => {
        if (type === "SQL Injection") return "attack-sql";
        if (type === "XSS Attack") return "attack-xss";
        if (type === "Suspicious Payload" || type === "Brute Force")
            return "attack-brute";
        return "attack-normal";
    };

    const formatTime = (ts) => {
        if (!ts) return "—";
        try {
            const d = new Date(ts);
            return d.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        } catch {
            return ts;
        }
    };

    if (!localStorage.getItem("user")) return null;

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dash-header">
                <div>
                    <h1 className="dash-title">
                        <span className="dash-icon">🛡️</span> Threat Monitor
                    </h1>
                    <p className="dash-subtitle">
                        Real-time honeypot attack intelligence dashboard
                    </p>
                </div>
                <div className="live-indicator">
                    <span className="live-dot"></span>
                    Live
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card" onClick={() => setActiveTab("logs")} style={{ cursor: "pointer" }}>
                    <div className="stat-card-icon">📊</div>
                    <div className="stat-card-info">
                        <span className="stat-card-number">{total}</span>
                        <span className="stat-card-label">Total Events</span>
                    </div>
                </div>
                <div className="stat-card stat-danger" onClick={() => setActiveTab("blocked")} style={{ cursor: "pointer", border: activeTab === "blocked" ? "2px solid var(--danger)" : "none" }}>
                    <div className="stat-card-icon">🚫</div>
                    <div className="stat-card-info">
                        <span className="stat-card-number">{blockedCount}</span>
                        <span className="stat-card-label">Banned IPs</span>
                    </div>
                </div>
                <div className="stat-card stat-warning">
                    <div className="stat-card-icon">💉</div>
                    <div className="stat-card-info">
                        <span className="stat-card-number">{sqlCount}</span>
                        <span className="stat-card-label">SQL Injections</span>
                    </div>
                </div>
                <div className="stat-card stat-info">
                    <div className="stat-card-icon">🔨</div>
                    <div className="stat-card-info">
                        <span className="stat-card-number">{bruteCount}</span>
                        <span className="stat-card-label">Brute Force</span>
                    </div>
                </div>
                <div className="stat-card stat-success">
                    <div className="stat-card-icon">✅</div>
                    <div className="stat-card-info">
                        <span className="stat-card-number">{normalCount}</span>
                        <span className="stat-card-label">Normal Traffic</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`nav-tab ${activeTab === "logs" ? "active" : ""}`}
                    onClick={() => setActiveTab("logs")}
                >
                    Activity Logs
                </button>
                <button
                    className={`nav-tab ${activeTab === "blocked" ? "active" : ""}`}
                    onClick={() => setActiveTab("blocked")}
                >
                    Blocked IP Registry
                </button>
            </div>

            {/* Filters (Only for logs) */}
            {activeTab === "logs" && (
                <div className="filters-bar">
                    <div className="filter-pills">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt}
                                className={`filter-pill ${filter === opt ? "active" : ""}`}
                                onClick={() => setFilter(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by IP address..."
                            value={searchIP}
                            onChange={(e) => setSearchIP(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div className="table-loading">
                        <div className="btn-spinner large"></div>
                        <p>Loading security intelligence...</p>
                    </div>
                ) : activeTab === "logs" ? (
                    filteredLogs.length === 0 ? (
                        <div className="table-empty">
                            <p>🎉 No attacks matching your filter. The honeypot is quiet.</p>
                        </div>
                    ) : (
                        <div className="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>IP Address</th>
                                        <th>Port</th>
                                        <th>Attack Type</th>
                                        <th>AI Classification</th>
                                        <th>Severity</th>
                                        <th>Risk</th>
                                        <th>Description</th>
                                        <th>Recommendation</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="ip-cell">
                                                <code>{log.ip || "—"}</code>
                                            </td>
                                            <td>{log.port}</td>
                                            <td>
                                                <span
                                                    className={`attack-badge ${getAttackClass(
                                                        log.attackType
                                                    )}`}
                                                >
                                                    {log.attackType}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`attack-badge ${getAttackClass(
                                                        log.aiAttackType
                                                    )}`}
                                                >
                                                    {log.aiAttackType}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`severity-badge ${getSeverityClass(
                                                        log.aiSeverity
                                                    )}`}
                                                >
                                                    {log.aiSeverity}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="risk-cell">
                                                    <div className="risk-bar-track">
                                                        <div
                                                            className="risk-bar-fill"
                                                            style={{
                                                                width: `${log.aiRiskScore || 0}%`,
                                                                background:
                                                                    (log.aiRiskScore || 0) >= 80
                                                                        ? "var(--danger)"
                                                                        : (log.aiRiskScore || 0) >= 50
                                                                            ? "var(--warning)"
                                                                            : "var(--success)",
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="risk-score">
                                                        {log.aiRiskScore || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="desc-cell">{log.aiDescription || "—"}</td>
                                            <td className="desc-cell">{log.aiSolution || "—"}</td>
                                            <td className="time-cell">{formatTime(log.timestamp)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    /* Blocked IPs Table */
                    blockedIps.length === 0 ? (
                        <div className="table-empty">
                            <p>🛡️ No IP addresses have been blocked yet.</p>
                        </div>
                    ) : (
                        <div className="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Banned IP Address</th>
                                        <th>Reason for Ban</th>
                                        <th>Time of Ban</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blockedIps.map((ip) => (
                                        <tr key={ip.id}>
                                            <td className="ip-cell" style={{ color: "var(--danger)", fontWeight: "bold" }}>
                                                <code>{ip.ipAddress}</code>
                                            </td>
                                            <td className="desc-cell">{ip.reason}</td>
                                            <td className="time-cell">{formatTime(ip.blockedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default Dashboard;
