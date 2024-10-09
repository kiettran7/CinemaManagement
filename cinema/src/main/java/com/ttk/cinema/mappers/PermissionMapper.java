package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.PermissionRequest;
import com.ttk.cinema.DTOs.response.PermissionResponse;
import com.ttk.cinema.POJOs.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
}