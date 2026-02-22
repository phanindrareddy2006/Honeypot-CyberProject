package com.example.honeypot.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.honeypot.model.AttackLog;
import com.example.honeypot.repository.AttackLogRepository;

import java.time.LocalDateTime;

@Component
public class AttackInterceptor implements HandlerInterceptor {

    private final AttackLogRepository repo;

    public AttackInterceptor(AttackLogRepository repo){
        this.repo = repo;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        String ip = request.getRemoteAddr();

        if(ip.equals("0:0:0:0:0:0:0:1")){
            ip = "127.0.0.1";
        }

        int port = request.getRemotePort();

        String agent = request.getHeader("User-Agent");

        String attackType = "Normal";

        if(agent != null && agent.contains("Nmap")){
            attackType = "Nmap Scan";
        }

        AttackLog log = new AttackLog();

        log.setIp(ip);
        log.setPort(port);
        log.setAttackType(attackType);
        log.setTimestamp(LocalDateTime.now());

        repo.save(log);

        return true;
    }
}