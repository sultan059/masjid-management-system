package com.masjid.app.controller;

import com.masjid.app.entity.Transaction;
import com.masjid.app.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<Page<Transaction>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(transactionService.getAllTransactions(page, size));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(transactionService.getTransactionStats());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Transaction>> searchTransactions(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(transactionService.searchTransactions(q, page, size));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Transaction>> filterByType(
            @RequestParam String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Transaction.TransactionType txType = Transaction.TransactionType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(transactionService.filterByType(txType, page, size));
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.createTransaction(transaction));
    }
}