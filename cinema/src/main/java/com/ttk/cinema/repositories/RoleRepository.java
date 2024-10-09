package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(String name);
    boolean existsByName(String name);

    // (Tùy chọn) Xóa tất cả các bản ghi trong bảng trung gian user_roles liên quan đến Role
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_roles WHERE roles_name = :roleName", nativeQuery = true)
    void deleteUserRolesByRoleName(String roleName);
}