package com.parksmart.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class BookingResponse {
    private Long id;
    private String slotCode;
    private String zone;
    private String plateNumber;
    private String vehicleType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double totalPrice;
    private String status;
    private String qrCodeData;
    private LocalDateTime createdAt;
}
