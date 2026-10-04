package com.parksmart.repository;

import com.parksmart.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUserId(Long userId);
    boolean existsByPlateNumber(String plateNumber);
}
