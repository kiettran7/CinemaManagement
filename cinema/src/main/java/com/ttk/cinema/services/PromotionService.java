package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.PromotionRequest;
import com.ttk.cinema.DTOs.response.PromotionResponse;
import com.ttk.cinema.POJOs.Promotion;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.PromotionMapper;
import com.ttk.cinema.repositories.BillRepository;
import com.ttk.cinema.repositories.PromotionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionService {
    PromotionRepository promotionRepository;
    PromotionMapper promotionMapper;
    BillRepository billRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public PromotionResponse createPromotion(PromotionRequest request) {
        Promotion promotion = promotionMapper.toPromotion(request);

        return promotionMapper.toPromotionResponse(promotionRepository.save(promotion));
    }

    public PromotionResponse getPromotion(String promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));
        return promotionMapper.toPromotionResponse(promotion);
    }

    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(promotionMapper::toPromotionResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deletePromotion(String promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));

        for (var bill : billRepository.findAll()) {
            if (bill.getPromotion() == promotion) {
                bill.setPromotion(null);
                billRepository.save(bill);
            }
        }

        promotionRepository.deleteById(promotionId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PromotionResponse updatePromotion(String promotionId, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));
        promotionMapper.updatePromotion(promotion, request);

        return promotionMapper.toPromotionResponse(promotionRepository.save(promotion));
    }
}