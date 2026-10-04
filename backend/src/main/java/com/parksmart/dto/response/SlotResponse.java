package com.parksmart.dto.response;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class SlotResponse {
    private Long id;
    private String slotCode;
    private String zone;
    private String slotType;
    private String status;
    private Double basePrice;
}
