package com.liangshou.movie.scripts.infrastructure.agentsupport.tools.tavily;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class TavilyClientConfig {

    @Bean
    public RestTemplate tavilyRestTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
