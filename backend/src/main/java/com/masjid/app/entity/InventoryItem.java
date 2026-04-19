package com.masjid.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "min_quantity")
    private Integer minQuantity = 5;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Category {
        ACCESSORIES, CLOTHING, BOOKS, FOOTWEAR, CLEANING, FOOD, OTHER
    }

    // Transient fields for frontend compatibility (not stored in DB)
    @Transient
    public String getStock() {
        return quantity != null ? quantity.toString() : "0";
    }

    @Transient
    public String getStatus() {
        if (quantity == null || minQuantity == null) return "In Stock";
        return quantity <= minQuantity ? "Low Stock" : "In Stock";
    }

    @Transient
    public Integer getMinThreshold() {
        return minQuantity;
    }
}
