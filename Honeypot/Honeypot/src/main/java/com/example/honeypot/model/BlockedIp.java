package com.example.honeypot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_ips")
public class BlockedIp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String reason;

    private LocalDateTime blockedAt;

    public BlockedIp() {
    }

    public BlockedIp(String ipAddress, String reason) {
        this.ipAddress = ipAddress;
        this.reason = reason;
        this.blockedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getBlockedAt() {
        return blockedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setBlockedAt(LocalDateTime blockedAt) {
        this.blockedAt = blockedAt;
    }
}
