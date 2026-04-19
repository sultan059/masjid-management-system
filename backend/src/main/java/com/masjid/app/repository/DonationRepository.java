package com.masjid.app.repository;

import com.masjid.app.entity.Donation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    Page<Donation> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.type = 'DONATION' AND d.createdAt >= :since")
    BigDecimal sumDonationsSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.type = 'ZAKAT' AND d.createdAt >= :since")
    BigDecimal sumZakatSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.createdAt >= :since")
    BigDecimal sumTotalSince(LocalDateTime since);
}