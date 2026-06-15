package com.leadmanagement.controller;

import com.leadmanagement.dto.DashboardResponse;
import com.leadmanagement.dto.LeadRequest;
import com.leadmanagement.dto.LeadResponse;
import com.leadmanagement.enums.LeadStatus;
import com.leadmanagement.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeadStatus status) {
        return ResponseEntity.ok(leadService.getAllLeads(search, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(@Valid @RequestBody LeadRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.createLead(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(@PathVariable Long id, @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(leadService.updateLead(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(leadService.getDashboard());
    }
}

