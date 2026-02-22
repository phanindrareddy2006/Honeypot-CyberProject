package com.example.honeypot.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.honeypot.model.AttackLog;
import com.example.honeypot.model.User;
import com.example.honeypot.repository.AttackLogRepository;
import com.example.honeypot.repository.UserRepository;
import com.example.honeypot.ai.GeminiService;
import com.example.honeypot.ai.AttackAnalyzer;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "*")

public class HoneypotController {

    @Autowired
    private AttackLogRepository repo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    private GeminiService geminiService;

    // ===== SIGNUP ENDPOINT =====
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.trim().isEmpty() ||
                password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required.");
        }

        Optional<User> existing = userRepo.findByUsername(username.trim());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken.");
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setPassword(encoder.encode(password));
        userRepo.save(user);

        return ResponseEntity.ok("Signup successful");
    }

    // ===== LOGIN HONEYPOT ENDPOINT =====
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> body,
            HttpServletRequest request) {

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        if (ip.equals("0:0:0:0:0:0:0:1")) {
            ip = "127.0.0.1";
        }

        String payload = body.toString();
        String username = body.get("username");
        String password = body.get("password");

        // 1. ACTUAL LOGIN VALIDATION FIRST
        boolean isValidLogin = false;
        if (username != null && password != null) {
            Optional<User> userOpt = userRepo.findByUsername(username.trim());
            if (userOpt.isPresent() && encoder.matches(password, userOpt.get().getPassword())) {
                isValidLogin = true;
            }
        }

        // 2. IF VALID, DO NOT LOG AS ATTACK, JUST RETURN SUCCESS
        if (isValidLogin && !payload.contains("OR") && !payload.contains("'")) {
            return ResponseEntity.ok("Login successful");
        }

        // 3. IF INVALID OR CONTAINS SQL INJECTION, TREAT AS ATTACK
        int port = request.getRemotePort();
        String attackType = "Failed Login / Suspicious";
        if (payload.contains("OR") || payload.contains("'")) {
            attackType = "SQL Injection";
        }

        // AI ANALYSIS via Gemini
        Object[] ai = geminiService.analyzePayload(payload);

        // Create Log
        AttackLog log = new AttackLog();
        log.setIp(ip);
        log.setPort(port);
        log.setAttackType(attackType);
        log.setTimestamp(LocalDateTime.now());
        log.setAiAttackType((String) ai[0]);
        log.setAiDescription((String) ai[1]);
        log.setAiSolution((String) ai[2]);
        log.setAiSeverity((String) ai[3]);
        log.setAiRiskScore((Integer) ai[4]);

        // Save to DB
        repo.save(log);

        // Auto-ban enforcement for 5 SEQUENTIAL SQL Injections
        List<AttackLog> recentLogs = repo.findTop5ByIpOrderByTimestampDesc(ip);
        if (recentLogs.size() >= 5 && !blockedIpRepo.existsByIpAddress(ip)) {
            boolean allSqlInjections = true;
            for (AttackLog l : recentLogs) {
                if (!"SQL Injection".equals(l.getAttackType())) {
                    allSqlInjections = false;
                    break;
                }
            }
            if (allSqlInjections) {
                System.out.println("🚨 AUTO-BAN ENFORCED for IP: " + ip);
                com.example.honeypot.model.BlockedIp blockedIp = new com.example.honeypot.model.BlockedIp(ip,
                        "5 consecutive SQL Injections detected via Web API");
                blockedIpRepo.save(blockedIp);
            }
        }

        // Send Live Update
        messagingTemplate.convertAndSend("/topic/attacks", log);

        // 4. If it was a valid login but contained SQLi, we log the attack but still
        // log them in
        if (isValidLogin) {
            return ResponseEntity.ok("Login successful (Suspicious payload logged)");
        }

        // Invalid credentials
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    // GET ALL LOGS
    @GetMapping("/attacks")
    public List<AttackLog> getLogs() {
        return repo.findAll();
    }

    // GET ALL BLOCKED IPS
    @Autowired
    private com.example.honeypot.repository.BlockedIpRepository blockedIpRepo;

    @GetMapping("/blocked-ips")
    public List<com.example.honeypot.model.BlockedIp> getBlockedIps() {
        return blockedIpRepo.findAll();
    }
}