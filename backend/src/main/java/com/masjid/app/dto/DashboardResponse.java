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
public class DashboardResponse {
    private BalanceInfo balance;
    private List<PrayerTime> prayerTimes;
    private String nextPrayer;
    private String nextPrayerTime;
    private List<AnnouncementItem> announcements;
    private StatsBand stats;
    private List<FeaturedEvent> featuredEvents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BalanceInfo {
        private double current;
        private double weekly;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrayerTime {
        private String name;
        private String time;
        private boolean active;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnnouncementItem {
        private Long id;
        private String title;
        private String description;
        private String timeAgo;
        private String icon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsBand {
        private int musallis;
        private double weeklyIncome;
        private int eventsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeaturedEvent {
        private Long id;
        private String title;
        private String date;
        private String time;
        private String location;
        private String imageUrl;
    }
}