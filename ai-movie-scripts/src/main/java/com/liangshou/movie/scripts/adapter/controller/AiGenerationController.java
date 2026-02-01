package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.service.impl.AIScriptWritingAgent;
import jakarta.annotation.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * AI生成控制器
 */
@RestController
@RequestMapping("/api/v1/ai")
public class AiGenerationController {

    @Resource
    private AIScriptWritingAgent aiScriptWritingAgent;

    /**
     * 生成创意
     */
    @PostMapping("/generate/creative")
    public ResponseEntity<Map<String, String>> generateCreative(@RequestBody Map<String, String> request) {
        String creativeRequest = request.getOrDefault("request", "");
        String result = aiScriptWritingAgent.generateCreative(creativeRequest);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.ok(response);
    }

    /**
     * 生成主题背景
     */
    @PostMapping("/generate/theme")
    public ResponseEntity<Map<String, String>> generateTheme(@RequestBody Map<String, String> request) {
        String themeRequest = request.getOrDefault("request", "");
        String result = aiScriptWritingAgent.generateTheme(themeRequest);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.ok(response);
    }

    /**
     * 生成剧情梗概
     */
    @PostMapping("/generate/summary")
    public ResponseEntity<Map<String, String>> generateSummary(@RequestBody Map<String, String> request) {
        String summaryRequest = request.getOrDefault("request", "");
        String result = aiScriptWritingAgent.generateSummary(summaryRequest);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.ok(response);
    }

    /**
     * 生成角色设计
     */
    @PostMapping("/generate/characters")
    public ResponseEntity<Map<String, String>> generateCharacters(@RequestBody Map<String, String> request) {
        String characterRequest = request.getOrDefault("request", "");
        String result = aiScriptWritingAgent.generateCharacters(characterRequest);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.ok(response);
    }

    /**
     * 生成故事大纲
     */
    @PostMapping("/generate/outline")
    public ResponseEntity<Map<String, String>> generateOutline(@RequestBody Map<String, String> request) {
        String outlineRequest = request.getOrDefault("request", "");
        String result = aiScriptWritingAgent.generateOutline(outlineRequest);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.ok(response);
    }

    /**
     * 生成章节内容
     */
    @PostMapping("/generate/chapter")
    public ResponseEntity<Map<String, String>> generateChapter(@RequestBody Map<String, String> request) {
        String chapterRequest = request.getOrDefault("request", "");
        String result = aiScriptWritingAgent.generateChapter(chapterRequest);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.ok(response);
    }
}