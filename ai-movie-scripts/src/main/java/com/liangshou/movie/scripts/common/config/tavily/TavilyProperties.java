package com.liangshou.movie.scripts.common.config.tavily;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "tavily")
public class TavilyProperties {
    private String apiKey;
    private String baseUrl = "https://api.tavily.com";
    private String projectId;
    private Integer maxResults = 5;
    private String searchDepth = "basic";
}
