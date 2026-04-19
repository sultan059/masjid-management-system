package com.masjid.app.service;

import com.masjid.app.entity.Donation;
import com.masjid.app.repository.DonationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    public Page<Donation> getAllDonations(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return donationRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Donation createDonation(Donation donation) {
        return donationRepository.save(donation);
    }

    public Map<String, Object> getDonationStats() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);

        Map<String, Object> stats = new HashMap<>();
        stats.put("weeklyTotal", donationRepository.sumTotalSince(weekAgo));
        stats.put("monthlyTotal", donationRepository.sumTotalSince(monthAgo));
        stats.put("weeklyZakat", donationRepository.sumZakatSince(weekAgo));
        stats.put("weeklyDonations", donationRepository.sumDonationsSince(weekAgo));
        stats.put("totalBalance", getTotalBalance());

        return stats;
    }

    public BigDecimal getTotalBalance() {
        LocalDateTime yearAgo = LocalDateTime.now().minusYears(1);
        return donationRepository.sumTotalSince(yearAgo);
    }
}