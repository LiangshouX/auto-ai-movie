package com.liangshou.movie.scripts.infrastructure.agentsupport.tools.tavily;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.liangshou.movie.scripts.common.config.tavily.TavilyProperties;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TavilySearchTool {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final TavilyProperties tavilyProperties;

    public TavilySearchTool(RestTemplate tavilyRestTemplate, ObjectMapper objectMapper, TavilyProperties tavilyProperties) {
        this.restTemplate = tavilyRestTemplate;
        this.objectMapper = objectMapper;
        this.tavilyProperties = tavilyProperties;
    }

    @Tool(name = "tavily_search", description = "使用 Tavily 在互联网上搜索信息，并返回可用于创作的摘要与来源链接。")
    public String search(@ToolParam(description = "搜索关键词或问题") String query) {
        if (!StringUtils.hasText(tavilyProperties.getApiKey())) {
            return "Tavily API Key 未配置，无法进行网络搜索。";
        }
        if (!StringUtils.hasText(query)) {
            return "query 不能为空。";
        }

        String url = tavilyProperties.getBaseUrl() + "/search";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(tavilyProperties.getApiKey());
        if (StringUtils.hasText(tavilyProperties.getProjectId())) {
            headers.add("X-Project-ID", tavilyProperties.getProjectId());
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("query", query);
        payload.put("search_depth", tavilyProperties.getSearchDepth());
        payload.put("max_results", tavilyProperties.getMaxResults());
        payload.put("include_answer", true);
        payload.put("include_raw_content", false);

        ResponseEntity<String> response = restTemplate.postForEntity(url, new HttpEntity<>(payload, headers), String.class);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            return "Tavily 搜索失败：" + response.getStatusCode();
        }

        try {
            Map<?, ?> root = objectMapper.readValue(response.getBody(), Map.class);
            String answer = root.get("answer") instanceof String ? (String) root.get("answer") : null;
            Object resultsObj = root.get("results");

            StringBuilder sb = new StringBuilder();
            if (StringUtils.hasText(answer)) {
                sb.append("摘要：").append(answer).append("\n");
            }

            if (resultsObj instanceof List<?> results) {
                sb.append("来源：").append("\n");
                for (Object r : results) {
                    if (!(r instanceof Map<?, ?> rm)) {
                        continue;
                    }
                    Object title = rm.get("title");
                    Object link = rm.get("url");
                    Object content = rm.get("content");
                    if (link != null) {
                        sb.append("- ").append(title != null ? title : "result").append(" ").append(link).append("\n");
                    }
                    if (content instanceof String c && StringUtils.hasText(c)) {
                        String snippet = c.length() > 240 ? c.substring(0, 240) + "..." : c;
                        sb.append("  要点：").append(snippet.replaceAll("\\s+", " ").trim()).append("\n");
                    }
                }
            } else {
                sb.append("未返回可用结果。");
            }

            return sb.toString().trim();
        } catch (Exception e) {
            return response.getBody();
        }
    }
}
