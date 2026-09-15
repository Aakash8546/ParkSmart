package com.parksmart.controller;

import com.parksmart.dto.request.BookingRequest;
import com.parksmart.dto.response.ApiResponse;
import com.parksmart.dto.response.BookingResponse;
import com.parksmart.service.BookingService;
import com.parksmart.service.QrCodeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired private BookingService bookingService;
    @Autowired private QrCodeService qrCodeService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.createBooking(userDetails.getUsername(), request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUserBookings(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getUserBookings(userDetails.getUsername())));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.cancelBooking(userDetails.getUsername(), id)));
    }

    @PutMapping("/{id}/extend")
    public ResponseEntity<ApiResponse<BookingResponse>> extendBooking(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.extendBooking(userDetails.getUsername(), id)));
    }

    @GetMapping(value = "/{id}/qr", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) {
        String qrData = bookingService.getBookingById(id).getQrCodeData();
        return ResponseEntity.ok(qrCodeService.generateQrCode(qrData, 200, 200));
    }
}
