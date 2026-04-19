package com.masjid.app.repository;

import com.masjid.app.entity.LedgerEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface LedgerRepository extends JpaRepository<LedgerEntry, Long> {
    Page<LedgerEntry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(CASE WHEN l.type = 'INCOME' THEN l.amount ELSE -l.amount END), 0) FROM LedgerEntry l")
    BigDecimal calculateBalance();

    @Query("SELECT COALESCE(SUM(CASE WHEN l.type = 'INCOME' THEN l.amount ELSE -l.amount END), 0) FROM LedgerEntry l WHERE l.createdAt >= :startDate")
    BigDecimal calculateWeeklyBalance(@Param("startDate") LocalDateTime startDate);
}
