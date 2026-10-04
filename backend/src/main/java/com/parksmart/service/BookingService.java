package com.parksmart.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parksmart.dto.request.BookingRequest;
import com.parksmart.dto.response.BookingResponse;
import com.parksmart.entity.Booking;
import com.parksmart.entity.ParkingSlot;
import com.parksmart.entity.User;
import com.parksmart.entity.Vehicle;
import com.parksmart.enums.BookingStatus;
import com.parksmart.enums.SlotStatus;
import com.parksmart.exception.BadRequestException;
import com.parksmart.exception.ResourceNotFoundException;
import com.parksmart.repository.BookingRepository;
import com.parksmart.repository.ParkingSlotRepository;
import com.parksmart.repository.UserRepository;
import com.parksmart.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ParkingSlotRepository parkingSlotRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private PricingService pricingService;
    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired private SlotService slotService;

    @Transactional
    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ParkingSlot slot = parkingSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new BadRequestException("Slot is not available");
        }

        Double price = pricingService.calculatePrice(slot, request.getStartTime(), request.getEndTime());
        
        Booking booking = Booking.builder()
                .user(user)
                .slot(slot)
                .vehicle(vehicle)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalPrice(price)
                .status(BookingStatus.ACTIVE)
                .build();

        booking = bookingRepository.save(booking);
        slot.setStatus(SlotStatus.RESERVED);
        parkingSlotRepository.save(slot);
        
        try {
            Map<String, Object> qrData = new HashMap<>();
            qrData.put("bookingId", booking.getId());
            qrData.put("slotCode", slot.getSlotCode());
            qrData.put("plateNumber", vehicle.getPlateNumber());
            booking.setQrCodeData(new ObjectMapper().writeValueAsString(qrData));
            booking = bookingRepository.save(booking);
        } catch (Exception e) {
            throw new RuntimeException("Error generating QR code data", e);
        }

        messagingTemplate.convertAndSend("/topic/slots", slotService.getAllSlots());

        return mapToResponse(booking);
    }

    public List<BookingResponse> getUserBookings(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelBooking(String email, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.getSlot().setStatus(SlotStatus.AVAILABLE);
        parkingSlotRepository.save(booking.getSlot());
        booking = bookingRepository.save(booking);
        
        messagingTemplate.convertAndSend("/topic/slots", slotService.getAllSlots());
        
        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse extendBooking(String email, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You can only extend your own bookings");
        }
        booking.setEndTime(booking.getEndTime().plusHours(1));
        booking.setTotalPrice(pricingService.calculatePrice(booking.getSlot(), booking.getStartTime(), booking.getEndTime()));
        return mapToResponse(bookingRepository.save(booking));
    }
    
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .slotCode(booking.getSlot().getSlotCode())
                .zone(booking.getSlot().getZone())
                .plateNumber(booking.getVehicle().getPlateNumber())
                .vehicleType(booking.getVehicle().getVehicleType().name())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .qrCodeData(booking.getQrCodeData())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
