package com.masjid.app.config;

import com.masjid.app.entity.*;
import com.masjid.app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository,
                               LedgerRepository ledgerRepository,
                               InventoryRepository inventoryRepository,
                               EventRepository eventRepository,
                               NotificationRepository notificationRepository,
                               TransactionRepository transactionRepository,
                               DonationRepository donationRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            // Only initialize if database is empty
            if (userRepository.count() == 0) {
                initUsers(userRepository, passwordEncoder);
            }

            if (ledgerRepository.count() == 0) {
                initLedgerEntries(ledgerRepository);
            }

            if (inventoryRepository.count() == 0) {
                initInventoryItems(inventoryRepository);
            }

            if (eventRepository.count() == 0) {
                initEvents(eventRepository);
            }

            if (notificationRepository.count() == 0) {
                initNotifications(notificationRepository);
            }

            if (transactionRepository.count() == 0) {
                initTransactions(transactionRepository);
            }

            if (donationRepository.count() == 0) {
                initDonations(donationRepository);
            }
        };
    }

    private void initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        String encodedPassword = passwordEncoder.encode("password123");

        User admin = new User();
        admin.setEmail("admin@masjid.com");
        admin.setPassword(encodedPassword);
        admin.setFullName("Administrator");
        admin.setRole(User.Role.ADMIN);
        admin.setEnabled(true);
        userRepository.save(admin);

        User imam = new User();
        imam.setEmail("imam@masjid.com");
        imam.setPassword(encodedPassword);
        imam.setFullName("Imam Hassan");
        imam.setRole(User.Role.IMAM);
        imam.setEnabled(true);
        userRepository.save(imam);

        User member = new User();
        member.setEmail("member@masjid.com");
        member.setPassword(encodedPassword);
        member.setFullName("Ahmad Rahman");
        member.setRole(User.Role.MEMBER);
        member.setEnabled(true);
        userRepository.save(member);
    }

    private void initLedgerEntries(LedgerRepository ledgerRepository) {
        String[] descriptions = {
            "Ramadan Donation - Abu Ahmad",
            "Zakat Collection - Friday",
            "General Sadaqah",
            "Electricity Bill",
            "Water Bill",
            "Cleaning Supplies",
            "Friday Khutbah Donation - Brothers",
            "Mosque Maintenance",
            "Food for Iftar Program",
            "Quran Collection"
        };

        BigDecimal[] amounts = {
            new BigDecimal("5000.00"), new BigDecimal("15000.00"), new BigDecimal("2500.00"),
            new BigDecimal("3500.00"), new BigDecimal("1200.00"), new BigDecimal("800.00"),
            new BigDecimal("8000.00"), new BigDecimal("4500.00"), new BigDecimal("12000.00"),
            new BigDecimal("3000.00")
        };

        LedgerEntry.EntryType[] types = {
            LedgerEntry.EntryType.INCOME, LedgerEntry.EntryType.INCOME, LedgerEntry.EntryType.INCOME,
            LedgerEntry.EntryType.EXPENSE, LedgerEntry.EntryType.EXPENSE, LedgerEntry.EntryType.EXPENSE,
            LedgerEntry.EntryType.INCOME, LedgerEntry.EntryType.EXPENSE, LedgerEntry.EntryType.EXPENSE,
            LedgerEntry.EntryType.INCOME
        };

        LedgerEntry.Category[] categories = {
            LedgerEntry.Category.DONATION, LedgerEntry.Category.ZAKAT, LedgerEntry.Category.DONATION,
            LedgerEntry.Category.UTILITY, LedgerEntry.Category.UTILITY, LedgerEntry.Category.MAINTENANCE,
            LedgerEntry.Category.DONATION, LedgerEntry.Category.MAINTENANCE, LedgerEntry.Category.COMMUNITY,
            LedgerEntry.Category.DONATION
        };

        for (int i = 0; i < descriptions.length; i++) {
            LedgerEntry entry = new LedgerEntry();
            entry.setDescription(descriptions[i]);
            entry.setAmount(amounts[i]);
            entry.setType(types[i]);
            entry.setCategory(categories[i]);
            entry.setCreatedAt(LocalDateTime.now().minusDays(i));
            ledgerRepository.save(entry);
        }
    }

    private void initInventoryItems(InventoryRepository inventoryRepository) {
        createAndSaveItem(inventoryRepository, "Prayer Mats", 50, "pieces", InventoryItem.Category.ACCESSORIES, 20);
        createAndSaveItem(inventoryRepository, "Hijab for Women", 30, "pieces", InventoryItem.Category.CLOTHING, 10);
        createAndSaveItem(inventoryRepository, "Tasbih (Prayer Beads)", 45, "pieces", InventoryItem.Category.ACCESSORIES, 15);
        createAndSaveItem(inventoryRepository, "Kufi Caps", 60, "pieces", InventoryItem.Category.CLOTHING, 25);
        createAndSaveItem(inventoryRepository, "Quran Copies", 25, "pieces", InventoryItem.Category.BOOKS, 10);
        createAndSaveItem(inventoryRepository, "Prayer Shoes (Kids)", 15, "pairs", InventoryItem.Category.FOOTWEAR, 10);
        createAndSaveItem(inventoryRepository, "Cleaning Detergent", 8, "bottles", InventoryItem.Category.CLEANING, 5);
        createAndSaveItem(inventoryRepository, "Floor Cleaner", 12, "bottles", InventoryItem.Category.CLEANING, 5);
    }

    private void createAndSaveItem(InventoryRepository repo, String name, int qty, String unit,
                                   InventoryItem.Category cat, int minQty) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setQuantity(qty);
        item.setUnit(unit);
        item.setCategory(cat);
        item.setMinQuantity(minQty);
        repo.save(item);
    }

    private void initEvents(EventRepository eventRepository) {
        Event e1 = new Event();
        e1.setTitle("Ramadan Community Iftar");
        e1.setDescription("Community Iftar program for Ramadan");
        e1.setEventDate(LocalDateTime.now().plusDays(3).withHour(18).withMinute(15));
        e1.setLocation("Main Hall");
        e1.setType(Event.EventType.COMMUNITY);
        e1.setAttendeeCount(250);
        e1.setFeatured(false);
        eventRepository.save(e1);

        Event e2 = new Event();
        e2.setTitle("Intermediate Arabic Class");
        e2.setDescription("Weekly Arabic language class");
        e2.setEventDate(LocalDateTime.now().plusDays(5).withHour(10).withMinute(0));
        e2.setLocation("Classroom 2");
        e2.setType(Event.EventType.EDUCATION);
        e2.setAttendeeCount(15);
        e2.setFeatured(false);
        eventRepository.save(e2);

        Event e3 = new Event();
        e3.setTitle("Youth Sports Day");
        e3.setDescription("Annual sports event for youth");
        e3.setEventDate(LocalDateTime.now().plusDays(10).withHour(14).withMinute(0));
        e3.setLocation("Adjacent Field");
        e3.setType(Event.EventType.YOUTH);
        e3.setAttendeeCount(80);
        e3.setFeatured(false);
        eventRepository.save(e3);

        Event featured = new Event();
        featured.setTitle("Eid-ul-Fitr Prayer & Celebration");
        featured.setDescription("Special Eid prayer and celebration ceremony");
        featured.setEventDate(LocalDateTime.now().plusDays(20).withHour(8).withMinute(30));
        featured.setLocation("Main Prayer Hall");
        featured.setType(Event.EventType.RELIGIOUS);
        featured.setAttendeeCount(500);
        featured.setFeatured(true);
        featured.setImageUrl("https://images.unsplash.com/photo-1542834759-4091398f7739");
        eventRepository.save(featured);
    }

    private void initNotifications(NotificationRepository notificationRepository) {
        createAndSaveNotification(notificationRepository,
            "New Donation Received", "A donation of ৳ 5,000 has been received for the Orphanage Fund.",
            Notification.NotificationType.SUCCESS, false);

        createAndSaveNotification(notificationRepository,
            "Low Stock Alert", "Al-Quran (Standard Size) stock is below threshold. Current: 8.",
            Notification.NotificationType.WARNING, false);

        createAndSaveNotification(notificationRepository,
            "Friday Khutbah Update", "The topic for this week's Khutbah has been updated by the Imam.",
            Notification.NotificationType.INFO, true);

        createAndSaveNotification(notificationRepository,
            "System Maintenance", "The system will be down for scheduled maintenance at 12:00 AM tonight.",
            Notification.NotificationType.INFO, true);

        createAndSaveNotification(notificationRepository,
            "Community Meeting", "Join the monthly community feedback session this Saturday after Maghrib.",
            Notification.NotificationType.INFO, true);
    }

    private void createAndSaveNotification(NotificationRepository repo, String title, String body,
                                           Notification.NotificationType type, boolean read) {
        Notification n = new Notification();
        n.setTitle(title);
        n.setBody(body);
        n.setType(type);
        n.setRead(read);
        repo.save(n);
    }

    private void initTransactions(TransactionRepository transactionRepository) {
        createAndSaveTransaction(transactionRepository, "Abu Ahmad", new BigDecimal("5000"),
            Transaction.TransactionType.CREDIT, "Ramadan Donation", Transaction.PaymentMethod.BANK_TRANSFER);
        createAndSaveTransaction(transactionRepository, "Anonymous", new BigDecimal("2000"),
            Transaction.TransactionType.CREDIT, "General Sadaqah", Transaction.PaymentMethod.CASH);
        createAndSaveTransaction(transactionRepository, "Brothers Committee", new BigDecimal("15000"),
            Transaction.TransactionType.CREDIT, "Zakat Distribution", Transaction.PaymentMethod.BANK_TRANSFER);
        createAndSaveTransaction(transactionRepository, "Electricity Board", new BigDecimal("3500"),
            Transaction.TransactionType.DEBIT, "Electricity Bill", Transaction.PaymentMethod.BANK_TRANSFER);
        createAndSaveTransaction(transactionRepository, "Water Authority", new BigDecimal("1200"),
            Transaction.TransactionType.DEBIT, "Water Bill", Transaction.PaymentMethod.BANK_TRANSFER);
        createAndSaveTransaction(transactionRepository, "Cleaning Supplies Inc", new BigDecimal("800"),
            Transaction.TransactionType.DEBIT, "Cleaning Supplies", Transaction.PaymentMethod.MOBILE_BANKING);
    }

    private void createAndSaveTransaction(TransactionRepository repo, String paidBy, BigDecimal amount,
                                          Transaction.TransactionType type, String purpose,
                                          Transaction.PaymentMethod method) {
        Transaction t = new Transaction();
        t.setPaidBy(paidBy);
        t.setAmount(amount);
        t.setType(type);
        t.setPurpose(purpose);
        t.setPaymentMethod(method);
        t.setTransactionDate(LocalDateTime.now().minusDays((int) (Math.random() * 10)));
        repo.save(t);
    }

    private void initDonations(DonationRepository donationRepository) {
        createAndSaveDonation(donationRepository, "Abu Ahmad", "abu.ahmad@email.com",
            new BigDecimal("5000"), Donation.DonationType.DONATION, Donation.PaymentMethod.BANK_TRANSFER);
        createAndSaveDonation(donationRepository, "Sister Fatima", "fatima@email.com",
            new BigDecimal("2500"), Donation.DonationType.SADAQAH, Donation.PaymentMethod.MOBILE_BANKING);
        createAndSaveDonation(donationRepository, "Brother Karim", "karim@email.com",
            new BigDecimal("15000"), Donation.DonationType.ZAKAT, Donation.PaymentMethod.BANK_TRANSFER);
        createAndSaveDonation(donationRepository, "Community General", null,
            new BigDecimal("3000"), Donation.DonationType.GENERAL, Donation.PaymentMethod.CASH);
    }

    private void createAndSaveDonation(DonationRepository repo, String name, String email,
                                        BigDecimal amount, Donation.DonationType type,
                                        Donation.PaymentMethod method) {
        Donation d = new Donation();
        d.setDonorName(name);
        d.setDonorEmail(email);
        d.setAmount(amount);
        d.setType(type);
        d.setPaymentMethod(method);
        d.setTransactionReference("TXN" + System.currentTimeMillis());
        repo.save(d);
    }
}
