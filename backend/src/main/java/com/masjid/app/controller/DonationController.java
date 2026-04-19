package com.masjid.app.controller;

import com.masjid.app.entity.Donation;
import com.masjid.app.service.DonationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<Page<Donation>> getAllDonations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(donationService.getAllDonations(page, size));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDonationStats() {
        return ResponseEntity.ok(donationService.getDonationStats());
    }

    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getBalance() {
        Map<String, Object> balance = Map.of(
            "balance", donationService.getTotalBalance(),
            "currency", "BDT"
        );
        return ResponseEntity.ok(balance);
    }

    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        return ResponseEntity.ok(donationService.createDonation(donation));
    }
}