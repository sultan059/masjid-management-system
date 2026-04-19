package com.masjid.app.controller;

import com.masjid.app.dto.DailyReport;
import com.masjid.app.service.AccountingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/accounting/reports")
public class ReportsController {

    private final AccountingService accountingService;

    public ReportsController(AccountingService accountingService) {
        this.accountingService = accountingService;
    }

    @GetMapping("/daily")
    public ResponseEntity<DailyReport> getDailyReport() {
        // For now return a simple report - can be enhanced later
        DailyReport report = DailyReport.builder()
                .date(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalIncome(0)
                .totalExpense(0)
                .netBalance(0)
                .transactionCount(0)
                .build();
        return ResponseEntity.ok(report);
    }
}
