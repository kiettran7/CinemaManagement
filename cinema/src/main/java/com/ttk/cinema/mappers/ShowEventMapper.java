package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.ShowEventRequest;
import com.ttk.cinema.DTOs.response.ShowEventResponse;
import com.ttk.cinema.POJOs.ShowEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ShowEventMapper {
    @Mapping(target = "showRoom", ignore = true)
    @Mapping(target = "showtime", ignore = true)
    @Mapping(target = "showSchedule", ignore = true)
    ShowEvent toShowEvent(ShowEventRequest request);

    ShowEventResponse toShowEventResponse(ShowEvent showEvent);

    @Mapping(target = "showRoom", ignore = true)
    @Mapping(target = "showtime", ignore = true)
    @Mapping(target = "showSchedule", ignore = true)
    void updateShowEvent(@MappingTarget ShowEvent showEvent, ShowEventRequest request);
}
