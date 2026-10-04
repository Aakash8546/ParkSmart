package com.parksmart.entity;

import com.parksmart.enums.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parking_slots")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ParkingSlot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slotCode;

    @Column(nullable = false)
    private String zone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SlotType slotType = SlotType.REGULAR;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SlotStatus status = SlotStatus.AVAILABLE;

    @Column(nullable = false)
    private Double basePrice;
}
