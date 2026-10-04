package com.parksmart.repository;

import com.parksmart.entity.ParkingSlot;
import com.parksmart.enums.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    List<ParkingSlot> findByZone(String zone);
    List<ParkingSlot> findByStatus(SlotStatus status);
    long countByStatus(SlotStatus status);
}
