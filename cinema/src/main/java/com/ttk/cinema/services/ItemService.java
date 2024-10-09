package com.ttk.cinema.services;

import com.ttk.cinema.DTOs.request.ItemRequest;
import com.ttk.cinema.DTOs.response.ItemResponse;
import com.ttk.cinema.POJOs.Item;
import com.ttk.cinema.exceptions.AppException;
import com.ttk.cinema.exceptions.ErrorCode;
import com.ttk.cinema.mappers.ItemMapper;
import com.ttk.cinema.repositories.ItemRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ItemService {
    ItemRepository itemRepository;
    ItemMapper itemMapper;

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ItemResponse createItem(ItemRequest request) {
        Item item = itemMapper.toItem(request);
        item = itemRepository.save(item);
        return itemMapper.toItemResponse(item);
    }

    public ItemResponse getItem(String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        return itemMapper.toItemResponse(item);
    }

    public List<ItemResponse> getAllItems() {
        return itemRepository.findAll().stream()
                .map(itemMapper::toItemResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void deleteItem(String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        itemRepository.deleteBillItemsByItem(item.getId());

        itemRepository.deleteById(item.getId());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ItemResponse updateItem(String itemId, ItemRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        itemMapper.updateItem(item, request);
        return itemMapper.toItemResponse(itemRepository.save(item));
    }
}