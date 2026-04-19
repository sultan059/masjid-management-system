package com.masjid.app.service;

import com.masjid.app.dto.ReportResponse;
import com.masjid.app.entity.LedgerEntry;
import com.masjid.app.repository.LedgerRepository;
import com.masjid.app.repository.DonationRepository;
import com.masjid.app.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final LedgerRepository ledgerRepository;
    private final TransactionRepository transactionRepository;
    private final DonationRepository donationRepository;

    public ReportService(LedgerRepository ledgerRepository,
                         TransactionRepository transactionRepository,
                         DonationRepository donationRepository) {
        this.ledgerRepository = ledgerRepository;
        this.transactionRepository = transactionRepository;
        this.donationRepository = donationRepository;
    }

    public ReportResponse getMonthlyReport() {
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        LocalDateTime twoMonthsAgo = LocalDateTime.now().minusDays(60);

        // Calculate totals
        BigDecimal currentMonthIncome = transactionRepository.sumIncomeSince(monthAgo);
        BigDecimal lastMonthIncome = transactionRepository.sumIncomeSince(twoMonthsAgo);

        double revenueGrowth = calculateGrowth(
                currentMonthIncome != null ? currentMonthIncome.doubleValue() : 0,
                lastMonthIncome != null ? lastMonthIncome.doubleValue() : 0
        );

        // Weekly trends
        List<ReportResponse.DailyTrend> weeklyTrends = getWeeklyTrends();

        // Fund distribution
        List<ReportResponse.FundDistribution> fundDistribution = getFundDistribution();

        return ReportResponse.builder()
                .totalRevenue(currentMonthIncome != null ? currentMonthIncome.doubleValue() : 0)
                .revenueGrowth(revenueGrowth)
                .newDonors(25) // Would need donor tracking
                .donorGrowth(5.2)
                .weeklyTrends(weeklyTrends)
                .fundDistribution(fundDistribution)
                .incomeByCategory(getIncomeByCategory())
                .expenseByCategory(getExpenseByCategory())
                .build();
    }

    private double calculateGrowth(double current, double previous) {
        if (previous == 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100 * 10) / 10.0;
    }

    private List<ReportResponse.DailyTrend> getWeeklyTrends() {
        List<ReportResponse.DailyTrend> trends = new ArrayList<>();
        String[] days = {"M", "T", "W", "T", "F", "S", "S"};
        double[] amounts = {40, 60, 30, 80, 50, 70, 45}; // Percentage mock data

        for (int i = 0; i < days.length; i++) {
            trends.add(ReportResponse.DailyTrend.builder()
                    .day(days[i])
                    .amount(amounts[i])
                    .build());
        }
        return trends;
    }

    private List<ReportResponse.FundDistribution> getFundDistribution() {
        List<ReportResponse.FundDistribution> distribution = new ArrayList<>();
        distribution.add(ReportResponse.FundDistribution.builder().label("General Masjid").percent("45%").color("#00450d").build());
        distribution.add(ReportResponse.FundDistribution.builder().label("Zakat Fund").percent("30%").color("#006e1c").build());
        distribution.add(ReportResponse.FundDistribution.builder().label("Maintenance").percent("15%").color("#755b00").build());
        distribution.add(ReportResponse.FundDistribution.builder().label("Others").percent("10%").color("#c0c9bb").build());
        return distribution;
    }

    private Map<String, Double> getIncomeByCategory() {
        Map<String, Double> income = new HashMap<>();
        income.put("DONATION", 32000.0);
        income.put("ZAKAT", 15000.0);
        income.put("SADAQAH", 5000.0);
        return income;
    }

    private Map<String, Double> getExpenseByCategory() {
        Map<String, Double> expense = new HashMap<>();
        expense.put("UTILITY", 4700.0);
        expense.put("MAINTENANCE", 5300.0);
        expense.put("COMMUNITY", 12000.0);
        return expense;
    }
}