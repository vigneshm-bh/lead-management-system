package com.leadmanagement.dto;

import com.leadmanagement.enums.LeadStatus;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private long totalLeads;
    private Map<LeadStatus, Long> leadsByStatus;
}

