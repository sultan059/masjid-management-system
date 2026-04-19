package com.masjid.app.repository;

import com.masjid.app.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findAllByOrderByTransactionDateDesc(Pageable pageable);

    Page<Transaction> findByPaidByContainingIgnoreCaseOrderByTransactionDateDesc(String paidBy, Pageable pageable);

    Page<Transaction> findByTypeOrderByTransactionDateDesc(Transaction.TransactionType type, Pageable pageable);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'CREDIT' AND t.transactionDate >= :since")
    BigDecimal sumIncomeSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'DEBIT' AND t.transactionDate >= :since")
    BigDecimal sumExpenseSince(LocalDateTime since);
}