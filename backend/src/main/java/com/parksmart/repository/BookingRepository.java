package com.parksmart.repository;

import com.parksmart.entity.Booking;
import com.parksmart.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findBySlotZoneAndStatus(String zone, BookingStatus status);
    
    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.status != 'CANCELLED'")
    Double getTotalRevenue();
    
    long countByCreatedAtAfter(LocalDateTime date);
    long countByStatus(BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.slot.zone = :zone")
    List<Booking> findByZone(String zone);
}
