package com.masjid.app.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyReport {
    private String date;
    private double totalIncome;
    private double totalExpense;
    private double netBalance;
    private int transactionCount;
    private Map<String, Double> incomeByCategory;
    private Map<String, Double> expenseByCategory;
}
