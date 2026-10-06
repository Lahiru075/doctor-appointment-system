package com.example.doctor_appointment_system_be.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("CliniQ - Doctor Appointment System API")
                        .version("1.0.0")
                        .description("REST API documentation for CliniQ Healthcare Platform")
                        .contact(new Contact().name("CliniQ Dev Team").email("support@cliniq.com")))
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth")) // (2) Box ekt dapu token eka Swagger eke execute click krana hama API ekakama Header ektm (Authorization: Bearer <token>) widiyt Auto danawa..
                .components(new Components() // (01) Authorize button eka and Token ek pest krnna Dialog box ekk hdanawa..
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .name("BearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
