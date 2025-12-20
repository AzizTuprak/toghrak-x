package com.toghrak.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class ToghrakPublishingPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(ToghrakPublishingPlatformApplication.class, args);
	}

}
