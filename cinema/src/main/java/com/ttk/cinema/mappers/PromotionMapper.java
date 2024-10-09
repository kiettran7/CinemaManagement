package com.ttk.cinema.mappers;

import com.ttk.cinema.DTOs.request.PromotionRequest;
import com.ttk.cinema.DTOs.response.PromotionResponse;
import com.ttk.cinema.POJOs.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    Promotion toPromotion(PromotionRequest request);
    PromotionResponse toPromotionResponse(Promotion promotion);

    void updatePromotion(@MappingTarget Promotion promotion, PromotionRequest request);
}
