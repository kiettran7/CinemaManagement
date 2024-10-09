package com.ttk.cinema.services;

import com.amazonaws.services.s3.AmazonS3;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AmazoneService {

    AmazonS3 amazonS3;
    Environment env;

    public String uploadFile(ByteArrayInputStream inputStream, String fileName) {
        String bucketName = env.getProperty("aws.s3.bucket");

        // Tạo tệp tạm thời
        File tempFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
        try (FileOutputStream out = new FileOutputStream(tempFile)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

        // Upload tệp lên S3
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, tempFile);
        amazonS3.putObject(putObjectRequest);

        // Xóa tệp tạm sau khi upload
        tempFile.delete();

        return generatePresignedUrl(fileName);
    }

    private String generatePresignedUrl(String keyName) {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
//        expTimeMillis += (1000 * 60 * 60) * 1; // 1 giờ
        expTimeMillis += (1000 * 60 * 60 * 24 * 7); // 7 ngày
        expiration.setTime(expTimeMillis);

        String bucketName = env.getProperty("aws.s3.bucket");

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, keyName)
                .withMethod(com.amazonaws.HttpMethod.GET)
                .withExpiration(expiration);

        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }
}