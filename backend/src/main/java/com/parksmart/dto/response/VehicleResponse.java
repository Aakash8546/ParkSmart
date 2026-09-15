package com.parksmart.dto.response;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class VehicleResponse {
    private Long id;
    private String plateNumber;
    private String vehicleType;
    private String modelName;
}
