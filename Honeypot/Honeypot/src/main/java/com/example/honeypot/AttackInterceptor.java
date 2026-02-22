package com.example.honeypot;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.honeypot.model.AttackLog;
import com.example.honeypot.model.BlockedIp;
import com.example.honeypot.repository.AttackLogRepository;
import com.example.honeypot.repository.BlockedIpRepository;

import java.time.LocalDateTime;

@Component
public class AttackInterceptor implements HandlerInterceptor {

    private final AttackLogRepository logRepo;
    private final BlockedIpRepository blockedIpRepo;

    public AttackInterceptor(AttackLogRepository logRepo, BlockedIpRepository blockedIpRepo) {
        this.logRepo = logRepo;
        this.blockedIpRepo = blockedIpRepo;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        if (ip.equals("0:0:0:0:0:0:0:1")) {
            ip = "127.0.0.1";
        }

        // ENFORCEMENT: Immediately drop request from blocked IPs
        // EXCEPT for the dashboard endpoints so the user can still see the logs
        String path = request.getRequestURI();
        if (blockedIpRepo.existsByIpAddress(ip) && !path.startsWith("/api/attacks")
                && !path.startsWith("/api/blocked-ips")) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter()
                    .write("Forbidden: Your IP address has been permanently blocked due to malicious activity.");
            return false;
        }

        int port = request.getRemotePort();
        String agent = request.getHeader("User-Agent");
        String attackType = null;

        if (agent != null && agent.contains("Nmap")) {
            attackType = "Nmap Scan";
        } else if (agent != null && (agent.contains("sqlmap") || agent.contains("nikto") || agent.contains("curl"))) {
            attackType = "Reconnaissance";
        }

        if (attackType != null) {
            AttackLog log = new AttackLog();
            log.setIp(ip);
            log.setPort(port);
            log.setAttackType(attackType);
            log.setTimestamp(LocalDateTime.now());
            logRepo.save(log);

            // Auto-ban logic for aggressive scanners
            checkAndBanIp(ip);
        }

        return true;
    }

    private void checkAndBanIp(String ip) {
        long maliciousCount = logRepo.countByIpAndAttackTypeNot(ip, "Normal");
        if (maliciousCount >= 5) {
            System.out.println("🚨 AUTO-BAN ENFORCED for IP: " + ip);
            BlockedIp blockedIp = new BlockedIp(ip,
                    "Exceeded maximum allowed malicious requests (" + maliciousCount + "+)");
            blockedIpRepo.save(blockedIp);
        }
    }
}