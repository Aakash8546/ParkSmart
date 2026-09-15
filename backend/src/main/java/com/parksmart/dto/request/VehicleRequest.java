package com.parksmart.dto.request;
import com.parksmart.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleRequest {
    @NotBlank private String plateNumber;
    @NotNull private VehicleType vehicleType;
    private String modelName;
}
