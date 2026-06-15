package com.leadmanagement.dto;

import com.leadmanagement.enums.LeadStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LeadResponse {
    private Long id;
    private String name;
    private String company;
    private String email;
    private String phone;
    private String source;
    private LeadStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

