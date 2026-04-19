package com.masjid.app.service;

import com.masjid.app.entity.LedgerEntry;
import com.masjid.app.repository.LedgerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AccountingService {

    private final LedgerRepository ledgerRepository;

    public AccountingService(LedgerRepository ledgerRepository) {
        this.ledgerRepository = ledgerRepository;
    }

    public Map<String, Object> getBalance() {
        BigDecimal balance = ledgerRepository.calculateBalance();
        BigDecimal weeklyBalance = ledgerRepository.calculateWeeklyBalance(LocalDateTime.now().minusDays(7));

        Map<String, Object> result = new HashMap<>();
        result.put("balance", balance != null ? balance : BigDecimal.ZERO);
        result.put("weeklyBalance", weeklyBalance != null ? weeklyBalance : BigDecimal.ZERO);
        return result;
    }

    public Page<LedgerEntry> getLedger(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ledgerRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public LedgerEntry addTransaction(LedgerEntry entry) {
        return ledgerRepository.save(entry);
    }
}
