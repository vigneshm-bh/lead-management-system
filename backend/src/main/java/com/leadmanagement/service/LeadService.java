package com.leadmanagement.service;

import com.leadmanagement.dto.DashboardResponse;
import com.leadmanagement.dto.LeadRequest;
import com.leadmanagement.dto.LeadResponse;
import com.leadmanagement.entity.Lead;
import com.leadmanagement.enums.LeadStatus;
import com.leadmanagement.exception.ResourceNotFoundException;
import com.leadmanagement.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public List<LeadResponse> getAllLeads(String search, LeadStatus status) {
        List<Lead> leads = leadRepository.searchLeads(search, status);
        return leads.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public LeadResponse getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        return mapToResponse(lead);
    }

    public LeadResponse createLead(LeadRequest request) {
        Lead lead = Lead.builder()
                .name(request.getName())
                .company(request.getCompany())
                .email(request.getEmail())
                .phone(request.getPhone())
                .source(request.getSource())
                .status(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW)
                .notes(request.getNotes())
                .build();

        Lead saved = leadRepository.save(lead);
        return mapToResponse(saved);
    }

    public LeadResponse updateLead(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));

        lead.setName(request.getName());
        lead.setCompany(request.getCompany());
        lead.setEmail(request.getEmail());
        lead.setPhone(request.getPhone());
        lead.setSource(request.getSource());
        lead.setStatus(request.getStatus() != null ? request.getStatus() : lead.getStatus());
        lead.setNotes(request.getNotes());

        Lead updated = leadRepository.save(lead);
        return mapToResponse(updated);
    }

    public void deleteLead(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead not found with id: " + id);
        }
        leadRepository.deleteById(id);
    }

    public DashboardResponse getDashboard() {
        long totalLeads = leadRepository.count();

        Map<LeadStatus, Long> leadsByStatus = new EnumMap<>(LeadStatus.class);
        for (LeadStatus status : LeadStatus.values()) {
            leadsByStatus.put(status, leadRepository.countByStatus(status));
        }

        return DashboardResponse.builder()
                .totalLeads(totalLeads)
                .leadsByStatus(leadsByStatus)
                .build();
    }

    private LeadResponse mapToResponse(Lead lead) {
        return LeadResponse.builder()
                .id(lead.getId())
                .name(lead.getName())
                .company(lead.getCompany())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .source(lead.getSource())
                .status(lead.getStatus())
                .notes(lead.getNotes())
                .createdAt(lead.getCreatedAt())
                .updatedAt(lead.getUpdatedAt())
                .build();
    }
}

