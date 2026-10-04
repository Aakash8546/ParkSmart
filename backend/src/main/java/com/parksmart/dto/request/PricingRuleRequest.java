package com.parksmart.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PricingRuleRequest {
    @NotBlank private String zone;
    @NotNull private Integer peakHourStart;
    @NotNull private Integer peakHourEnd;
    @NotNull private Double multiplier;
}
