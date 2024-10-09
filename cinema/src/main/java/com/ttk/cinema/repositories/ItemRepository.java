package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {
    // Xóa các bản ghi trong bảng trung gian bill_items liên quan đến Item
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM bill_items WHERE items_id = :itemId", nativeQuery = true)
    void deleteBillItemsByItem(String itemId);
}

