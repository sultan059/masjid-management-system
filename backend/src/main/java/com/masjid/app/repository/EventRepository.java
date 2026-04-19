package com.masjid.app.repository;

import com.masjid.app.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findAllByOrderByEventDateDesc(Pageable pageable);

    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDateTime date);

    List<Event> findByFeaturedTrueOrderByEventDateAsc();

    List<Event> findByEventDateBetweenOrderByEventDateAsc(LocalDateTime start, LocalDateTime end);

    long countByEventDateAfter(LocalDateTime date);
}