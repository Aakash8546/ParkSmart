package com.parksmart.controller;

import com.parksmart.dto.request.VehicleRequest;
import com.parksmart.dto.response.ApiResponse;
import com.parksmart.dto.response.PlateDetectionResponse;
import com.parksmart.dto.response.VehicleResponse;
import com.parksmart.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    @Autowired private VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.addVehicle(userDetails.getUsername(), request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getUserVehicles(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getUserVehicles(userDetails.getUsername())));
    }

    @PostMapping("/detect-plate")
    public ResponseEntity<ApiResponse<PlateDetectionResponse>> detectPlate(@RequestParam("image") MultipartFile image) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.detectPlate(image)));
    }
}
