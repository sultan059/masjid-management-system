package com.masjid.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "donor_name")
    private String donorName;

    @Column(name = "donor_email")
    private String donorEmail;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod = PaymentMethod.CASH;

    @Column(name = "transaction_reference")
    private String transactionReference;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum DonationType {
        DONATION, ZAKAT, SADAQAH, GENERAL
    }

    public enum PaymentMethod {
        CASH, BANK_TRANSFER, MOBILE_BANKING, CARD
    }
}
