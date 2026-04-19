package com.masjid.app.controller;

import com.masjid.app.entity.InventoryItem;
import com.masjid.app.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounting/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getInventory() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItem(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @PostMapping
    public ResponseEntity<InventoryItem> addItem(@RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.addItem(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateItem(@PathVariable Long id, @RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.updateItem(id, item));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<InventoryItem> updateQuantity(@PathVariable Long id, @RequestParam int quantity) {
        return ResponseEntity.ok(inventoryService.updateQuantity(id, quantity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItem>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }
}
