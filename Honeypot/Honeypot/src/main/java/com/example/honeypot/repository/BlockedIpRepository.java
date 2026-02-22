package com.example.honeypot.repository;

import com.example.honeypot.model.BlockedIp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlockedIpRepository extends JpaRepository<BlockedIp, Long> {
    Optional<BlockedIp> findByIpAddress(String ipAddress);

    boolean existsByIpAddress(String ipAddress);
}
