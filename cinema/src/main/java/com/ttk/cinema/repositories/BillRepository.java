package com.ttk.cinema.repositories;

import com.ttk.cinema.POJOs.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface BillRepository extends JpaRepository<Bill, String> {
    // Xóa các bản ghi trong bảng trung gian bill_items liên quan đến Bill
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM bill_items WHERE bill_id = :billId", nativeQuery = true)
    void deleteBillItemsById(String billId);
}

