package com.parksmart.controller;

import com.parksmart.dto.request.PricingRuleRequest;
import com.parksmart.dto.response.ApiResponse;
import com.parksmart.dto.response.BookingResponse;
import com.parksmart.dto.response.DashboardStats;
import com.parksmart.dto.response.SlotResponse;
import com.parksmart.entity.PricingRule;
import com.parksmart.enums.SlotStatus;
import com.parksmart.enums.SlotType;
import com.parksmart.repository.PricingRuleRepository;
import com.parksmart.service.AdminService;
import com.parksmart.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired private AdminService adminService;
    @Autowired private SlotService slotService;
    @Autowired private PricingRuleRepository pricingRuleRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllBookings(status, zone, date)));
    }

    @PutMapping("/slots/{id}")
    public ResponseEntity<ApiResponse<SlotResponse>> updateSlot(
            @PathVariable Long id,
            @RequestParam(required = false) SlotStatus status,
            @RequestParam(required = false) SlotType type,
            @RequestParam(required = false) Double basePrice) {
        return ResponseEntity.ok(ApiResponse.success(slotService.updateSlot(id, status, type, basePrice)));
    }

    @PutMapping("/pricing")
    public ResponseEntity<ApiResponse<PricingRule>> updatePricingRule(@RequestBody PricingRuleRequest request) {
        PricingRule rule = pricingRuleRepository.findByZone(request.getZone()).orElse(new PricingRule());
        rule.setZone(request.getZone());
        rule.setPeakHourStart(request.getPeakHourStart());
        rule.setPeakHourEnd(request.getPeakHourEnd());
        rule.setMultiplier(request.getMultiplier());
        return ResponseEntity.ok(ApiResponse.success(pricingRuleRepository.save(rule)));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv() {
        String csv = adminService.exportBookingsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bookings.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes());
    }
}
