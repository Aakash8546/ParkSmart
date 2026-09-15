package com.parksmart.controller;

import com.parksmart.dto.response.ApiResponse;
import com.parksmart.dto.response.SlotResponse;
import com.parksmart.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {
    @Autowired
    private SlotService slotService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getAllSlots() {
        return ResponseEntity.ok(ApiResponse.success(slotService.getAllSlots()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SlotResponse>> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            SlotResponse.builder()
                .id(slotService.getSlotById(id).getId())
                .slotCode(slotService.getSlotById(id).getSlotCode())
                .zone(slotService.getSlotById(id).getZone())
                .slotType(slotService.getSlotById(id).getSlotType().name())
                .status(slotService.getSlotById(id).getStatus().name())
                .basePrice(slotService.getSlotById(id).getBasePrice())
                .build()
        ));
    }
}
