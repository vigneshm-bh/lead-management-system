package com.leadmanagement.dto;

import com.leadmanagement.enums.LeadStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LeadRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String company;

    @Email(message = "Please enter a valid email address")
    @Pattern(regexp = "^$|^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
             message = "Email must be in the format user@example.com")
    private String email;

    @Pattern(regexp = "^$|^[+]?[\\d\\s\\-().]{7,20}$",
             message = "Phone must contain 7-15 digits and can include +, -, (), spaces")
    private String phone;

    private String source;

    private LeadStatus status;

    private String notes;
}
