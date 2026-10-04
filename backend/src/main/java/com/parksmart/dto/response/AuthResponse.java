package com.parksmart.dto.response;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private String email;
}
