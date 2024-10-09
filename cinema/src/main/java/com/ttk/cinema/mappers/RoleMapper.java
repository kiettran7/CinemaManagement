package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.RoleRequest;
import com.ttk.cinema.DTOs.response.RoleResponse;
import com.ttk.cinema.POJOs.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}