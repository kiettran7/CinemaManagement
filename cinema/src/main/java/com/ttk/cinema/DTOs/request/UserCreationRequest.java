package com.ttk.cinema.DTOs.request;

import com.ttk.cinema.validators.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 3, message = "USERNAME_INVALID")
    String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
    String password;

    @Email(message = "Email error")
    String email;

    String phone;

    @NotBlank(message = "Full name must not null")
    String fullName;

    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate birthday;
    MultipartFile file;
}