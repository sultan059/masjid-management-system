package com.masjid.app.controller;

import com.masjid.app.entity.LedgerEntry;
import com.masjid.app.service.AccountingService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/accounting")
public class AccountingController {

    private final AccountingService accountingService;

    public AccountingController(AccountingService accountingService) {
        this.accountingService = accountingService;
    }

    @GetMapping("/ledger/balance")
    public ResponseEntity<Map<String, Object>> getBalance() {
        return ResponseEntity.ok(accountingService.getBalance());
    }

    @GetMapping("/ledger")
    public ResponseEntity<Page<LedgerEntry>> getLedger(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(accountingService.getLedger(page, size));
    }

    @PostMapping("/ledger")
    public ResponseEntity<LedgerEntry> addTransaction(@RequestBody LedgerEntry entry) {
        return ResponseEntity.ok(accountingService.addTransaction(entry));
    }
}
