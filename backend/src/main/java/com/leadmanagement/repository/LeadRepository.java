package com.leadmanagement.repository;

import com.leadmanagement.entity.Lead;
import com.leadmanagement.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    @Query("SELECT l FROM Lead l WHERE " +
            "(:search IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(l.company) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "OR LOWER(l.email) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))) " +
            "AND (:status IS NULL OR l.status = :status)")
    List<Lead> searchLeads(@Param("search") String search, @Param("status") LeadStatus status);

    Long countByStatus(LeadStatus status);
}

