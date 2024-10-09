package com.ttk.cinema.DTOs.request;

import com.ttk.cinema.validators.DobConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String username;
    String password;
    String email;
    String phone;
    String fullName;
    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate birthday;
    MultipartFile file;
    Set<String> roles;
}