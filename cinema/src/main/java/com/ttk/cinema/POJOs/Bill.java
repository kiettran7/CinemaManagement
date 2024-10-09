package com.ttk.cinema.POJOs;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    float totalAmount;
    float customerPaid;

    @Column(length = 2048)
    String pdfUrl;

    @Column(length = 2048)
    String vnp_TmnCode; // Mã định danh (app/website/dịch vụ) của merchant trên hệ thống của VNPAY

    @ManyToOne
    Promotion promotion;

    @ManyToMany
    List<Item> items;
}
