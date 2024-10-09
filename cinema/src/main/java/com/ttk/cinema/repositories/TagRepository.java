package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TagRepository extends JpaRepository<Tag, String> {
    @Override
    List<Tag> findAllById(Iterable<String> strings);
    List<Tag> findByTagName(String tagName);
    List<Tag>findByTagNameIn(List<String> tagNames);

    // Xóa các bản ghi trong bảng trung gian movie_tags liên quan đến Tag
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_tags WHERE tags_id = :tagId", nativeQuery = true)
    void deleteMovieTagsByTagId(String tagId);
}
