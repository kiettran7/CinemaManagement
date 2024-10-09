package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.ShowRoomRequest;
import com.ttk.cinema.DTOs.response.ShowRoomResponse;
import com.ttk.cinema.POJOs.ShowRoom;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ShowRoomMapper {
    ShowRoom toShowRoom(ShowRoomRequest request);
    ShowRoomResponse toShowRoomResponse(ShowRoom showRoom);

    void updateShowRoom(@MappingTarget ShowRoom showRoom, ShowRoomRequest request);
}
