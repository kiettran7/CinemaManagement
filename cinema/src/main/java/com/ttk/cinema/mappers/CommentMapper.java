package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.CommentRequest;
import com.ttk.cinema.DTOs.request.MovieRequest;
import com.ttk.cinema.DTOs.response.CommentResponse;
import com.ttk.cinema.DTOs.response.MovieResponse;
import com.ttk.cinema.POJOs.Comment;
import com.ttk.cinema.POJOs.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "user", ignore = true)
    Comment toComment(CommentRequest request);

    CommentResponse toCommentResponse(Comment comment);

    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateComment(@MappingTarget Comment comment, CommentRequest request);
}
