package com.leadmanagement.dto;

import com.leadmanagement.enums.LeadStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeadRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String company;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private String source;

    private LeadStatus status;

    private String notes;
}

