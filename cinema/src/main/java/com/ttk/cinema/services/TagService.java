package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.TagRequest;
import com.ttk.cinema.DTOs.response.TagResponse;
import com.ttk.cinema.POJOs.Tag;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.TagMapper;
import com.ttk.cinema.repositories.TagRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TagService {
    TagRepository tagRepository;
    TagMapper tagMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public TagResponse createTag(TagRequest request) {
        Tag tag = tagMapper.toTag(request);

        return tagMapper.toTagResponse(tagRepository.save(tag));
    }

    public TagResponse getTag(String tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new AppException(ErrorCode.TAG_NOT_FOUND));
        return tagMapper.toTagResponse(tag);
    }

    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(tagMapper::toTagResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTag(String tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new AppException(ErrorCode.TAG_NOT_FOUND));

        tagRepository.deleteMovieTagsByTagId(tag.getId());

        tagRepository.deleteById(tag.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public TagResponse updateTag(String tagId, TagRequest request) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new AppException(ErrorCode.TAG_NOT_FOUND));

        tagMapper.updateTag(tag, request);

        return tagMapper.toTagResponse(tagRepository.save(tag));
    }
}