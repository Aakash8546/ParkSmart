package com.parksmart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pricing_rules")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PricingRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String zone;

    private Integer peakHourStart;
    private Integer peakHourEnd;
    private Double multiplier;
}
