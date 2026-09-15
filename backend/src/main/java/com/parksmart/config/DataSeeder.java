package com.parksmart.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parksmart.entity.*;
import com.parksmart.enums.*;
import com.parksmart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private ParkingSlotRepository slotRepository;
    @Autowired private PricingRuleRepository pricingRuleRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("Seeding data...");

            // Users
            User admin = userRepository.save(User.builder().name("Admin User").email("admin@parksmart.com").passwordHash(passwordEncoder.encode("admin123")).role(UserRole.ADMIN).phone("1234567890").build());
            User aakash = userRepository.save(User.builder().name("Aakash Srivastava").email("aakash@parksmart.com").passwordHash(passwordEncoder.encode("user123")).role(UserRole.USER).phone("9876543210").build());
            User guard = userRepository.save(User.builder().name("Guard One").email("guard@parksmart.com").passwordHash(passwordEncoder.encode("guard123")).role(UserRole.GUARD).phone("1112223333").build());

            // Pricing Rules
            pricingRuleRepository.save(PricingRule.builder().zone("A").peakHourStart(9).peakHourEnd(11).multiplier(1.5).build());
            pricingRuleRepository.save(PricingRule.builder().zone("B").peakHourStart(9).peakHourEnd(11).multiplier(1.5).build());
            pricingRuleRepository.save(PricingRule.builder().zone("C").peakHourStart(17).peakHourEnd(20).multiplier(2.0).build());
            pricingRuleRepository.save(PricingRule.builder().zone("D").peakHourStart(9).peakHourEnd(11).multiplier(1.3).build());

            // Slots
            for (int i = 1; i <= 6; i++) {
                slotRepository.save(ParkingSlot.builder().slotCode("A" + i).zone("A").slotType(SlotType.REGULAR).basePrice(50.0).build());
                slotRepository.save(ParkingSlot.builder().slotCode("B" + i).zone("B").slotType(SlotType.REGULAR).basePrice(50.0).build());
                slotRepository.save(ParkingSlot.builder().slotCode("C" + i).zone("C").slotType(SlotType.PREMIUM).basePrice(80.0).build());
            }
            for (int i = 1; i <= 4; i++) {
                slotRepository.save(ParkingSlot.builder().slotCode("D" + i).zone("D").slotType(SlotType.REGULAR).basePrice(40.0).build());
            }
            slotRepository.save(ParkingSlot.builder().slotCode("D5").zone("D").slotType(SlotType.HANDICAP).basePrice(30.0).build());
            slotRepository.save(ParkingSlot.builder().slotCode("D6").zone("D").slotType(SlotType.HANDICAP).basePrice(30.0).build());

            // Vehicles
            Vehicle v1 = vehicleRepository.save(Vehicle.builder().user(aakash).plateNumber("MH 12 AB 1234").vehicleType(VehicleType.CAR).modelName("Honda City").build());
            Vehicle v2 = vehicleRepository.save(Vehicle.builder().user(aakash).plateNumber("MH 14 CD 5678").vehicleType(VehicleType.SUV).modelName("Honda CR-V").build());

            // Bookings
            ParkingSlot slotA1 = slotRepository.findByZone("A").stream().filter(s -> s.getSlotCode().equals("A1")).findFirst().get();
            ParkingSlot slotB3 = slotRepository.findByZone("B").stream().filter(s -> s.getSlotCode().equals("B3")).findFirst().get();
            ParkingSlot slotC2 = slotRepository.findByZone("C").stream().filter(s -> s.getSlotCode().equals("C2")).findFirst().get();

            slotA1.setStatus(SlotStatus.RESERVED);
            slotB3.setStatus(SlotStatus.RESERVED);
            slotRepository.saveAll(List.of(slotA1, slotB3));

            Booking b1 = Booking.builder().user(aakash).slot(slotA1).vehicle(v1).startTime(LocalDateTime.now().plusHours(1)).endTime(LocalDateTime.now().plusHours(3)).totalPrice(100.0).status(BookingStatus.ACTIVE).build();
            Booking b2 = Booking.builder().user(aakash).slot(slotB3).vehicle(v2).startTime(LocalDateTime.now().plusHours(2)).endTime(LocalDateTime.now().plusHours(5)).totalPrice(150.0).status(BookingStatus.ACTIVE).build();
            Booking b3 = Booking.builder().user(aakash).slot(slotC2).vehicle(v1).startTime(LocalDateTime.now().minusDays(1)).endTime(LocalDateTime.now().minusDays(1).plusHours(2)).totalPrice(160.0).status(BookingStatus.COMPLETED).build();

            b1 = bookingRepository.save(b1);
            b2 = bookingRepository.save(b2);
            b3 = bookingRepository.save(b3);

            ObjectMapper mapper = new ObjectMapper();
            
            Map<String, Object> map1 = new HashMap<>(); map1.put("bookingId", b1.getId()); map1.put("slotCode", "A1"); map1.put("plateNumber", v1.getPlateNumber());
            b1.setQrCodeData(mapper.writeValueAsString(map1));
            
            Map<String, Object> map2 = new HashMap<>(); map2.put("bookingId", b2.getId()); map2.put("slotCode", "B3"); map2.put("plateNumber", v2.getPlateNumber());
            b2.setQrCodeData(mapper.writeValueAsString(map2));
            
            Map<String, Object> map3 = new HashMap<>(); map3.put("bookingId", b3.getId()); map3.put("slotCode", "C2"); map3.put("plateNumber", v1.getPlateNumber());
            b3.setQrCodeData(mapper.writeValueAsString(map3));
            
            bookingRepository.saveAll(List.of(b1, b2, b3));

            System.out.println("Data seeded successfully!");
        }
    }
}
