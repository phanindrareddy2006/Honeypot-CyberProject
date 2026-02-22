package com.example.honeypot.ai;

public class AttackAnalyzer {

    public static Object[] analyze(String payload) {

        String lowerPayload = payload.toLowerCase();

        String type = "Normal";
        String desc = "Normal user activity detected.";
        String solution = "No action needed.";
        String severity = "Low";
        int risk = 10;


        // === SQL Injection ===
        if (payload.contains("'") || payload.contains("OR ") ||
            lowerPayload.contains("union") || lowerPayload.contains("select ") ||
            lowerPayload.contains("drop ") || lowerPayload.contains("insert ") ||
            lowerPayload.contains("delete ") || lowerPayload.contains("--") ||
            lowerPayload.contains("1=1") || lowerPayload.contains("or 1")) {

            type = "SQL Injection";
            desc = "SQL injection attempt detected — attacker tried authentication bypass or data extraction.";
            solution = "Use prepared statements, parameterized queries, and input validation.";
            severity = "Critical";
            risk = 95;
        }

        // === XSS Attack ===
        else if (lowerPayload.contains("<script") || lowerPayload.contains("javascript:") ||
                 lowerPayload.contains("onerror") || lowerPayload.contains("onload") ||
                 lowerPayload.contains("<img") || lowerPayload.contains("<iframe") ||
                 lowerPayload.contains("alert(")) {

            type = "XSS Attack";
            desc = "Cross-Site Scripting (XSS) attempt detected — malicious script injection.";
            solution = "Sanitize all user inputs, enable Content Security Policy (CSP), use output encoding.";
            severity = "High";
            risk = 85;
        }

        // === Command Injection ===
        else if (lowerPayload.contains(";ls") || lowerPayload.contains("; ls") ||
                 lowerPayload.contains("| cat") || lowerPayload.contains("&& cat") ||
                 lowerPayload.contains("; rm") || lowerPayload.contains("| whoami") ||
                 lowerPayload.contains("; whoami") || lowerPayload.contains("$(") ||
                 lowerPayload.contains("`")) {

            type = "Command Injection";
            desc = "OS command injection attempt — attacker tried to execute system commands.";
            solution = "Never pass user input to system commands. Use allowlists for valid inputs.";
            severity = "Critical";
            risk = 92;
        }

        // === Directory Traversal ===
        else if (lowerPayload.contains("../") || lowerPayload.contains("..\\") ||
                 lowerPayload.contains("/etc/passwd") || lowerPayload.contains("/etc/shadow") ||
                 lowerPayload.contains("c:\\windows")) {

            type = "Directory Traversal";
            desc = "Path traversal attempt — attacker tried to access restricted files on the server.";
            solution = "Validate and sanitize file paths. Use chroot jails and restrict file access.";
            severity = "High";
            risk = 80;
        }

        // === Nmap / Port Scan signatures ===
        else if (lowerPayload.contains("nmap") || lowerPayload.contains("masscan") ||
                 lowerPayload.contains("nikto") || lowerPayload.contains("gobuster") ||
                 lowerPayload.contains("dirbuster") || lowerPayload.contains("sqlmap")) {

            type = "Reconnaissance";
            desc = "Scanning tool signature detected — attacker is performing reconnaissance.";
            solution = "Deploy IDS/IPS, implement rate limiting, and monitor for scanning patterns.";
            severity = "Medium";
            risk = 65;
        }

        // === Suspicious / Brute Force (long payload) ===
        else if (payload.length() > 30) {

            type = "Suspicious Payload";
            desc = "Unusually long input detected — possible brute force or fuzzing attempt.";
            solution = "Apply rate limiting, account lockout policies, and CAPTCHA verification.";
            severity = "Medium";
            risk = 60;
        }


        return new Object[]{type, desc, solution, severity, risk};
    }
}