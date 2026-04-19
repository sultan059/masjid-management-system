package com.masjid.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ledger")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum EntryType {
        INCOME, EXPENSE
    }

    public enum Category {
        DONATION, ZAKAT, SADAQAH, UTILITY, MAINTENANCE, COMMUNITY, EVENT, OTHER
    }
}
