package com.parksmart.service;

import com.parksmart.dto.response.BookingResponse;
import com.parksmart.dto.response.DashboardStats;
import com.parksmart.entity.Booking;
import com.parksmart.enums.BookingStatus;
import com.parksmart.enums.SlotStatus;
import com.parksmart.repository.BookingRepository;
import com.parksmart.repository.ParkingSlotRepository;
import com.parksmart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private ParkingSlotRepository slotRepository;
    @Autowired private UserRepository userRepository;

    public DashboardStats getDashboardStats() {
        Double totalRevenue = bookingRepository.getTotalRevenue();
        long todaysBookings = bookingRepository.countByCreatedAtAfter(LocalDate.now().atStartOfDay());
        long activeUsers = userRepository.count();
        long totalSlots = slotRepository.count();
        long availableSlots = slotRepository.countByStatus(SlotStatus.AVAILABLE);
        long occupiedSlots = slotRepository.countByStatus(SlotStatus.OCCUPIED) + slotRepository.countByStatus(SlotStatus.RESERVED);
        
        Double occupancyRate = totalSlots == 0 ? 0.0 : ((double) occupiedSlots / totalSlots) * 100;

        return DashboardStats.builder()
                .totalRevenue(totalRevenue)
                .todaysBookings(todaysBookings)
                .occupancyRate(occupancyRate)
                .activeUsers(activeUsers)
                .totalSlots(totalSlots)
                .availableSlots(availableSlots)
                .occupiedSlots(occupiedSlots)
                .build();
    }

    public List<BookingResponse> getAllBookings(String status, String zone, String date) {
        List<Booking> bookings;
        if (status != null && !status.isEmpty()) {
            bookings = bookingRepository.findByStatus(BookingStatus.valueOf(status));
        } else if (zone != null && !zone.isEmpty()) {
            bookings = bookingRepository.findByZone(zone);
        } else {
            bookings = bookingRepository.findAll();
        }
        
        return bookings.stream().map(b -> BookingResponse.builder()
                .id(b.getId())
                .slotCode(b.getSlot().getSlotCode())
                .zone(b.getSlot().getZone())
                .plateNumber(b.getVehicle().getPlateNumber())
                .vehicleType(b.getVehicle().getVehicleType().name())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .totalPrice(b.getTotalPrice())
                .status(b.getStatus().name())
                .createdAt(b.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    public String exportBookingsCsv() {
        List<Booking> bookings = bookingRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Slot Code,Zone,Plate Number,Start Time,End Time,Total Price,Status,Created At\n");
        for (Booking b : bookings) {
            csv.append(b.getId()).append(",")
               .append(b.getSlot().getSlotCode()).append(",")
               .append(b.getSlot().getZone()).append(",")
               .append(b.getVehicle().getPlateNumber()).append(",")
               .append(b.getStartTime()).append(",")
               .append(b.getEndTime()).append(",")
               .append(b.getTotalPrice()).append(",")
               .append(b.getStatus()).append(",")
               .append(b.getCreatedAt()).append("\n");
        }
        return csv.toString();
    }
}
