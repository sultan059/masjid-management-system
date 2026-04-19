package com.masjid.app.service;

import com.masjid.app.entity.Notification;
import com.masjid.app.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findByOrderByCreatedAtDesc();
    }

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByReadFalseOrderByCreatedAtDesc();
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
}