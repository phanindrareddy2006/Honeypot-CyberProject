package com.example.honeypot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.honeypot.model.AttackLog;

import java.util.List;

public interface AttackLogRepository extends JpaRepository<AttackLog, Integer> {
    long countByIp(String ip);

    long countByIpAndAttackTypeNot(String ip, String attackType);

    List<AttackLog> findTop5ByIpOrderByTimestampDesc(String ip);
}