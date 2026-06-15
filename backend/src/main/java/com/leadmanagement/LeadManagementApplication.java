package com.leadmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LeadManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeadManagementApplication.class, args);
    }
}

