package com.masjid.app.controller;

import com.masjid.app.dto.ReportResponse;
import com.masjid.app.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ReportResponse> getMonthlyReport() {
        return ResponseEntity.ok(reportService.getMonthlyReport());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getQuickStats() {
        ReportResponse report = reportService.getMonthlyReport();
        Map<String, Object> stats = Map.of(
            "totalRevenue", report.getTotalRevenue(),
            "revenueGrowth", report.getRevenueGrowth(),
            "newDonors", report.getNewDonors(),
            "donorGrowth", report.getDonorGrowth()
        );
        return ResponseEntity.ok(stats);
    }
}