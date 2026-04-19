package com.masjid.app.service;

import com.masjid.app.entity.InventoryItem;
import com.masjid.app.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem getItemById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public InventoryItem addItem(InventoryItem item) {
        return inventoryRepository.save(item);
    }

    public InventoryItem updateItem(Long id, InventoryItem updated) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setName(updated.getName());
        item.setQuantity(updated.getQuantity());
        item.setUnit(updated.getUnit());
        item.setCategory(updated.getCategory());
        item.setMinQuantity(updated.getMinQuantity());
        item.setUpdatedAt(LocalDateTime.now());
        return inventoryRepository.save(item);
    }

    public InventoryItem updateQuantity(Long id, int quantity) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setQuantity(quantity);
        item.setUpdatedAt(LocalDateTime.now());
        return inventoryRepository.save(item);
    }

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }

    public List<InventoryItem> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }
}
