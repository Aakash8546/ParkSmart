package com.parksmart.service;

import com.parksmart.dto.response.SlotResponse;
import com.parksmart.entity.ParkingSlot;
import com.parksmart.enums.SlotStatus;
import com.parksmart.enums.SlotType;
import com.parksmart.exception.ResourceNotFoundException;
import com.parksmart.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SlotService {
    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<SlotResponse> getAllSlots() {
        return parkingSlotRepository.findAll().stream().map(slot -> 
            SlotResponse.builder()
                .id(slot.getId())
                .slotCode(slot.getSlotCode())
                .zone(slot.getZone())
                .slotType(slot.getSlotType().name())
                .status(slot.getStatus().name())
                .basePrice(slot.getBasePrice())
                .build()
        ).collect(Collectors.toList());
    }

    public ParkingSlot getSlotById(Long id) {
        return parkingSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));
    }

    public SlotResponse updateSlot(Long id, SlotStatus status, SlotType type, Double basePrice) {
        ParkingSlot slot = getSlotById(id);
        if (status != null) slot.setStatus(status);
        if (type != null) slot.setSlotType(type);
        if (basePrice != null) slot.setBasePrice(basePrice);
        parkingSlotRepository.save(slot);
        messagingTemplate.convertAndSend("/topic/slots", getAllSlots());
        return SlotResponse.builder()
                .id(slot.getId())
                .slotCode(slot.getSlotCode())
                .zone(slot.getZone())
                .slotType(slot.getSlotType().name())
                .status(slot.getStatus().name())
                .basePrice(slot.getBasePrice())
                .build();
    }
}
