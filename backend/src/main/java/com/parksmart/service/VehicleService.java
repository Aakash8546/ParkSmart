package com.parksmart.service;

import com.parksmart.dto.request.VehicleRequest;
import com.parksmart.dto.response.PlateDetectionResponse;
import com.parksmart.dto.response.VehicleResponse;
import com.parksmart.entity.User;
import com.parksmart.entity.Vehicle;
import com.parksmart.exception.BadRequestException;
import com.parksmart.exception.ResourceNotFoundException;
import com.parksmart.repository.UserRepository;
import com.parksmart.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RestTemplate restTemplate;

    @Value("${ml-service.url:http://localhost:5001}")
    private String mlServiceUrl;

    public VehicleResponse addVehicle(String email, VehicleRequest request) {
        if (vehicleRepository.existsByPlateNumber(request.getPlateNumber())) {
            throw new BadRequestException("Plate number already registered");
        }
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Vehicle vehicle = Vehicle.builder()
                .user(user)
                .plateNumber(request.getPlateNumber())
                .vehicleType(request.getVehicleType())
                .modelName(request.getModelName())
                .build();
        vehicle = vehicleRepository.save(vehicle);
        return mapToResponse(vehicle);
    }

    public List<VehicleResponse> getUserVehicles(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return vehicleRepository.findByUserId(user.getId()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public PlateDetectionResponse detectPlate(MultipartFile image) {
        try {
            String url = mlServiceUrl + "/detect-plate";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename() != null ? image.getOriginalFilename() : "vehicle.jpg";
                }
            });
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<PlateDetectionResponse> response = restTemplate.postForEntity(url, requestEntity, PlateDetectionResponse.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Plate detection failed: " + e.getMessage(), e);
        }
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .plateNumber(vehicle.getPlateNumber())
                .vehicleType(vehicle.getVehicleType().name())
                .modelName(vehicle.getModelName())
                .build();
    }
}
