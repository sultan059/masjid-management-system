package com.masjid.app.service;

import com.masjid.app.entity.Transaction;
import com.masjid.app.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Page<Transaction> getAllTransactions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findAllByOrderByTransactionDateDesc(pageable);
    }

    public Page<Transaction> searchTransactions(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findByPaidByContainingIgnoreCaseOrderByTransactionDateDesc(query, pageable);
    }

    public Page<Transaction> filterByType(Transaction.TransactionType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findByTypeOrderByTransactionDateDesc(type, pageable);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Map<String, Object> getTransactionStats() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);

        Map<String, Object> stats = new HashMap<>();
        stats.put("weeklyIncome", transactionRepository.sumIncomeSince(weekAgo));
        stats.put("monthlyIncome", transactionRepository.sumIncomeSince(monthAgo));
        stats.put("weeklyExpense", transactionRepository.sumExpenseSince(weekAgo));
        stats.put("monthlyExpense", transactionRepository.sumExpenseSince(monthAgo));

        return stats;
    }
}