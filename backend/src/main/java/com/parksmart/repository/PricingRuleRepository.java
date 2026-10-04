package com.parksmart.repository;

import com.parksmart.entity.PricingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PricingRuleRepository extends JpaRepository<PricingRule, Long> {
    Optional<PricingRule> findByZone(String zone);
}
