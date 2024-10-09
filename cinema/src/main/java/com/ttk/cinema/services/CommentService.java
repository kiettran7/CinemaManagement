package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.CommentRequest;
import com.ttk.cinema.DTOs.response.CommentResponse;
import com.ttk.cinema.POJOs.Comment;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.CommentMapper;
import com.ttk.cinema.repositories.CommentRepository;
import com.ttk.cinema.repositories.MovieRepository;
import com.ttk.cinema.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    CommentRepository commentRepository;
    CommentMapper commentMapper;
    MovieRepository movieRepository;
    UserRepository userRepository;

    String pythonApiUrl = "http://localhost:5000/spam";

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public CommentResponse createComment(CommentRequest request) {
        Comment comment = commentMapper.toComment(request);

        var movie = movieRepository.findById(request.getMovie())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        var user = userRepository.findById(request.getUser())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        comment.setUser(user);
        comment.setMovie(movie);
        comment.setContent(request.getContent());

        String commentContent = comment.getContent();

        // Chuẩn bị body yêu cầu cho API Python
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("content", commentContent);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Gửi yêu cầu POST đến API Python
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> responseEntity = restTemplate.exchange(pythonApiUrl, HttpMethod.POST, requestEntity, Map.class);

        // Xử lý phản hồi từ API Python
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = responseEntity.getBody();

            // 1 tich cuc - 0 tieu cuc
            int spam = (int) responseBody.getOrDefault("spam", null);

            // Lấy câu trả lời từ mô hình
            String modelResponse = (String) responseBody.getOrDefault("modelResponse", "");

            // Cập nhật params để bao gồm sentiment và modelResponse
            comment.setSentiment(String.valueOf(spam));
            comment.setModelResponse(modelResponse);

        } else {
            // Xử lý lỗi
            System.out.println("Đã xảy ra lỗi khi gọi API Python: " + responseEntity.getStatusCode());
        }


        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    public CommentResponse getComment(String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        return commentMapper.toCommentResponse(comment);
    }

    public List<CommentResponse> getAllComments() {
        return commentRepository.findAll().stream()
                .map(commentMapper::toCommentResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void deleteComment(String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        commentRepository.deleteById(comment.getId());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public CommentResponse updateComment(String commentId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
       commentMapper.updateComment(comment, request);
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }
}