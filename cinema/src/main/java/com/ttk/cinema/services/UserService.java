package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.UserCreationRequest;
import com.ttk.cinema.DTOs.request.UserUpdateRequest;
import com.ttk.cinema.DTOs.response.UserResponse;
import com.ttk.cinema.POJOs.Role;
import com.ttk.cinema.POJOs.Ticket;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.UserMapper;
import com.ttk.cinema.POJOs.User;
import com.ttk.cinema.repositories.CommentRepository;
import com.ttk.cinema.repositories.RoleRepository;
import com.ttk.cinema.repositories.TicketRepository;
import com.ttk.cinema.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    CloudinaryService cloudinaryService;
    TicketRepository ticketRepository;
    CommentRepository commentRepository;

    public UserResponse createUser(UserCreationRequest request) throws IOException {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toUser(request);

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            user.setAvatar(cloudinaryService.uploadFile(request.getFile()));
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role role;
//        if (request.isCustomer()) {
        role = this.roleRepository.findById("CUSTOMER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
//        } else {
//            role = this.roleRepository.findById("STAFF")
//                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
//        }
        roles.add(role);
        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getFile() != null && !request.getFile().isEmpty()) {
            user.setAvatar(cloudinaryService.uploadFile(request.getFile()));
        }

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var tickets = ticketRepository.findAll();
        var comments = commentRepository.findAll();

        for (Ticket ticket : tickets) {
            if (ticket.getCustomer() != null && user == ticket.getCustomer()) {
                ticket.setCustomer(null);
                ticketRepository.save(ticket);
            }
            if (ticket.getStaff() != null && user == ticket.getStaff()) {
                ticket.setStaff(null);
                ticketRepository.save(ticket);
            }
        }

        for (var comment : comments) {
            if (comment.getUser() == user) {
                comment.setUser(null);
                commentRepository.save(comment);
            }
        }

        userRepository.deleteUserRolesByUserId(user.getUserId());

        userRepository.delete(user);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUser(String userId) {
        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }
}
