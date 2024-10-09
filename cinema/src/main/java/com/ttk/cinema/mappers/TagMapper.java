package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.TagRequest;
import com.ttk.cinema.DTOs.response.TagResponse;
import com.ttk.cinema.POJOs.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TagMapper {
    Tag toTag(TagRequest request);
    TagResponse toTagResponse(Tag tag);

    void updateTag(@MappingTarget Tag tag, TagRequest request);
}
