package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Role;
import com.ttk.cinema.POJOs.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // Xóa các bản ghi trong bảng trung gian user_roles liên quan đến User
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_roles WHERE users_user_id = :userId", nativeQuery = true)
    void deleteUserRolesByUserId(String userId);
}
