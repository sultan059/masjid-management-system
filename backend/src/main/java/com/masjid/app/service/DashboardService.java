package com.masjid.app.service;

import com.masjid.app.dto.DashboardResponse;
import com.masjid.app.entity.Event;
import com.masjid.app.entity.Notification;
import com.masjid.app.repository.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final LedgerRepository ledgerRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;
    private final TransactionRepository transactionRepository;

    public DashboardService(LedgerRepository ledgerRepository,
                            EventRepository eventRepository,
                            NotificationRepository notificationRepository,
                            TransactionRepository transactionRepository) {
        this.ledgerRepository = ledgerRepository;
        this.eventRepository = eventRepository;
        this.notificationRepository = notificationRepository;
        this.transactionRepository = transactionRepository;
    }

    public DashboardResponse getDashboardData() {
        DashboardResponse.BalanceInfo balanceInfo = getBalanceInfo();
        List<DashboardResponse.PrayerTime> prayerTimes = getPrayerTimes();
        var nextPrayerInfo = getNextPrayer(prayerTimes);
        List<DashboardResponse.AnnouncementItem> announcements = getAnnouncements();
        DashboardResponse.StatsBand statsBand = getStatsBand();
        List<DashboardResponse.FeaturedEvent> featuredEvents = getFeaturedEvents();

        return DashboardResponse.builder()
                .balance(balanceInfo)
                .prayerTimes(prayerTimes)
                .nextPrayer(nextPrayerInfo[0])
                .nextPrayerTime(nextPrayerInfo[1])
                .announcements(announcements)
                .stats(statsBand)
                .featuredEvents(featuredEvents)
                .build();
    }

    private DashboardResponse.BalanceInfo getBalanceInfo() {
        BigDecimal balance = ledgerRepository.calculateBalance();
        BigDecimal weekly = ledgerRepository.calculateWeeklyBalance(LocalDateTime.now().minusDays(7));
        return DashboardResponse.BalanceInfo.builder()
                .current(balance != null ? balance.doubleValue() : 0)
                .weekly(weekly != null ? weekly.doubleValue() : 0)
                .build();
    }

    private List<DashboardResponse.PrayerTime> getPrayerTimes() {
        // Static prayer times - can be made dynamic with a PrayerTimeService
        List<DashboardResponse.PrayerTime> times = new ArrayList<>();
        times.add(DashboardResponse.PrayerTime.builder().name("Fajr").time("04:52 AM").active(false).build());
        times.add(DashboardResponse.PrayerTime.builder().name("Dhuhr").time("12:05 PM").active(false).build());
        times.add(DashboardResponse.PrayerTime.builder().name("Asr").time("04:15 PM").active(true).build());
        times.add(DashboardResponse.PrayerTime.builder().name("Maghrib").time("06:12 PM").active(false).build());
        times.add(DashboardResponse.PrayerTime.builder().name("Isha").time("07:34 PM").active(false).build());
        return times;
    }

    private String[] getNextPrayer(List<DashboardResponse.PrayerTime> prayerTimes) {
        // Simplified - returns Asr as next since it's marked active in UI
        return new String[]{"Asr", "04:15 PM"};
    }

    private List<DashboardResponse.AnnouncementItem> getAnnouncements() {
        List<Notification> notifications = notificationRepository.findByOrderByCreatedAtDesc();
        return notifications.stream()
                .limit(5)
                .map(n -> DashboardResponse.AnnouncementItem.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .description(n.getBody())
                        .timeAgo(getTimeAgo(n.getCreatedAt()))
                        .icon(n.getType().name().toLowerCase())
                        .build())
                .collect(Collectors.toList());
    }

    private String getTimeAgo(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(dateTime, now).toMinutes();
        if (minutes < 60) return minutes + "m ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + "h ago";
        long days = hours / 24;
        return days + "d ago";
    }

    private DashboardResponse.StatsBand getStatsBand() {
        long eventCount = eventRepository.countByEventDateAfter(LocalDateTime.now());
        BigDecimal weeklyIncome = transactionRepository.sumIncomeSince(LocalDateTime.now().minusDays(7));

        return DashboardResponse.StatsBand.builder()
                .musallis(1200) // Static for now - would need attendee tracking
                .weeklyIncome(weeklyIncome != null ? weeklyIncome.doubleValue() : 0)
                .eventsCount((int) eventCount)
                .build();
    }

    private List<DashboardResponse.FeaturedEvent> getFeaturedEvents() {
        List<Event> featured = eventRepository.findByFeaturedTrueOrderByEventDateAsc();
        return featured.stream()
                .limit(3)
                .map(e -> DashboardResponse.FeaturedEvent.builder()
                        .id(e.getId())
                        .title(e.getTitle())
                        .date(e.getEventDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                        .time(e.getEventDate().toLocalTime().format(DateTimeFormatter.ofPattern("hh:mm a")))
                        .location(e.getLocation())
                        .imageUrl(e.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }
}