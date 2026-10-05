package com.parksmart.config;

import com.parksmart.entity.*;
import com.parksmart.enums.*;
import com.parksmart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

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
            System.out.println("Seeding initial configuration & slots...");

            // Default Accounts
            User admin = userRepository.save(User.builder().name("Admin User").email("admin@parksmart.com").passwordHash(passwordEncoder.encode("admin123")).role(UserRole.ADMIN).phone("1234567890").build());
            User aakash = userRepository.save(User.builder().name("Aakash Srivastava").email("aakash@parksmart.com").passwordHash(passwordEncoder.encode("user123")).role(UserRole.USER).phone("9876543210").build());
            User guard = userRepository.save(User.builder().name("Guard One").email("guard@parksmart.com").passwordHash(passwordEncoder.encode("guard123")).role(UserRole.GUARD).phone("1112223333").build());

            // Pricing Rules
            pricingRuleRepository.save(PricingRule.builder().zone("A").peakHourStart(9).peakHourEnd(11).multiplier(1.5).build());
            pricingRuleRepository.save(PricingRule.builder().zone("B").peakHourStart(9).peakHourEnd(11).multiplier(1.5).build());
            pricingRuleRepository.save(PricingRule.builder().zone("C").peakHourStart(17).peakHourEnd(20).multiplier(2.0).build());
            pricingRuleRepository.save(PricingRule.builder().zone("D").peakHourStart(9).peakHourEnd(11).multiplier(1.3).build());

            // 24 Parking Slots — All initialized as AVAILABLE (Green)
            for (int i = 1; i <= 6; i++) {
                slotRepository.save(ParkingSlot.builder().slotCode("A" + i).zone("A").slotType(SlotType.REGULAR).status(SlotStatus.AVAILABLE).basePrice(50.0).build());
                slotRepository.save(ParkingSlot.builder().slotCode("B" + i).zone("B").slotType(SlotType.REGULAR).status(SlotStatus.AVAILABLE).basePrice(50.0).build());
                slotRepository.save(ParkingSlot.builder().slotCode("C" + i).zone("C").slotType(SlotType.PREMIUM).status(SlotStatus.AVAILABLE).basePrice(80.0).build());
            }
            for (int i = 1; i <= 4; i++) {
                slotRepository.save(ParkingSlot.builder().slotCode("D" + i).zone("D").slotType(SlotType.REGULAR).status(SlotStatus.AVAILABLE).basePrice(40.0).build());
            }
            slotRepository.save(ParkingSlot.builder().slotCode("D5").zone("D").slotType(SlotType.HANDICAP).status(SlotStatus.AVAILABLE).basePrice(30.0).build());
            slotRepository.save(ParkingSlot.builder().slotCode("D6").zone("D").slotType(SlotType.HANDICAP).status(SlotStatus.AVAILABLE).basePrice(30.0).build());

            // Seed user's vehicle for easy booking
            vehicleRepository.save(Vehicle.builder().user(aakash).plateNumber("MH 12 AB 1234").vehicleType(VehicleType.CAR).modelName("Honda City").build());

            System.out.println("24 slots seeded as AVAILABLE.");
        } else {
            // Clean up any old persistent demo bookings on cloud database
            List<ParkingSlot> allSlots = slotRepository.findAll();
            boolean hasNonAvailable = allSlots.stream().anyMatch(s -> s.getStatus() != SlotStatus.AVAILABLE);
            if (hasNonAvailable) {
                allSlots.forEach(s -> s.setStatus(SlotStatus.AVAILABLE));
                slotRepository.saveAll(allSlots);
                bookingRepository.deleteAll();
                System.out.println("Cleaned persistent cloud database: all slots reset to AVAILABLE.");
            }
        }
    }
}
