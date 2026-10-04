package com.parksmart.dto.request;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    @NotNull private Long slotId;
    @NotNull private Long vehicleId;
    @NotNull private LocalDateTime startTime;
    @NotNull private LocalDateTime endTime;
}
