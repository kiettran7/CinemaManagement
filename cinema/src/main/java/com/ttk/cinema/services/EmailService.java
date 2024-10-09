package com.ttk.cinema.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo("kiettran.cv@gmail.com");
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void sendEmailWithAttachment(String to, String subject, String body, ByteArrayInputStream attachmentStream, String attachmentName) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;

        try {
            helper = new MimeMessageHelper(message, true); // true indicates multipart message
            helper.setTo("kiettran.cv@gmail.com");
            helper.setSubject(subject);
            helper.setText(body, true); // true indicates HTML content

            // Chuyển đổi ByteArrayInputStream thành ByteArrayResource
            ByteArrayResource resource = new ByteArrayResource(attachmentStream.readAllBytes());

            helper.addAttachment(attachmentName, resource);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}