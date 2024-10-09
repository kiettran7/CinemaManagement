package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Bill;
import com.ttk.cinema.POJOs.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
}

