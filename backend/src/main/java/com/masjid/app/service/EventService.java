package com.masjid.app.service;

import com.masjid.app.entity.Event;
import com.masjid.app.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Page<Event> getAllEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventRepository.findAllByOrderByEventDateDesc(pageable);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDateTime.now());
    }

    public List<Event> getFeaturedEvents() {
        return eventRepository.findByFeaturedTrueOrderByEventDateAsc();
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event updated) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setEventDate(updated.getEventDate());
        existing.setLocation(updated.getLocation());
        existing.setType(updated.getType());
        existing.setAttendeeCount(updated.getAttendeeCount());
        existing.setFeatured(updated.isFeatured());
        existing.setImageUrl(updated.getImageUrl());
        existing.setUpdatedAt(LocalDateTime.now());
        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public long countUpcomingEvents() {
        return eventRepository.countByEventDateAfter(LocalDateTime.now());
    }
}