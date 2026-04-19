package com.masjid.app.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private double totalRevenue;
    private double revenueGrowth;
    private int newDonors;
    private double donorGrowth;
    private List<DailyTrend> weeklyTrends;
    private List<FundDistribution> fundDistribution;
    private Map<String, Double> incomeByCategory;
    private Map<String, Double> expenseByCategory;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyTrend {
        private String day;
        private double amount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FundDistribution {
        private String label;
        private String percent;
        private String color;
    }
}