package com.parksmart.service;

import com.parksmart.entity.ParkingSlot;
import com.parksmart.entity.PricingRule;
import com.parksmart.repository.PricingRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class PricingService {
    @Autowired
    private PricingRuleRepository pricingRuleRepository;

    public Double calculatePrice(ParkingSlot slot, LocalDateTime start, LocalDateTime end) {
        long hours = ChronoUnit.HOURS.between(start, end);
        if (hours < 1) hours = 1;
        
        Double baseTotal = slot.getBasePrice() * hours;
        
        Optional<PricingRule> ruleOpt = pricingRuleRepository.findByZone(slot.getZone());
        if (ruleOpt.isPresent()) {
            PricingRule rule = ruleOpt.get();
            boolean overlapsPeak = false;
            for (LocalDateTime t = start; t.isBefore(end); t = t.plusHours(1)) {
                int hour = t.getHour();
                if (hour >= rule.getPeakHourStart() && hour < rule.getPeakHourEnd()) {
                    overlapsPeak = true;
                    break;
                }
            }
            if (overlapsPeak) {
                return baseTotal * rule.getMultiplier();
            }
        }
        return baseTotal;
    }
}
