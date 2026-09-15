package com.parksmart.dto.response;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DashboardStats {
    private Double totalRevenue;
    private Long todaysBookings;
    private Double occupancyRate;
    private Long activeUsers;
    private Long totalSlots;
    private Long availableSlots;
    private Long occupiedSlots;
}
