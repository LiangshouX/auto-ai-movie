package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.service.conversation.ConversationService;
import com.liangshou.movie.scripts.service.dto.conversation.ConversationMessageDto;
import com.liangshou.movie.scripts.service.dto.conversation.ConversationSummaryDto;
import com.liangshou.movie.scripts.service.dto.conversation.CreateConversationRequest;
import com.liangshou.movie.scripts.service.dto.conversation.PageResponse;
import com.liangshou.movie.scripts.service.dto.conversation.RenameConversationRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<PageResponse<ConversationSummaryDto>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword
    ) {
        String userId = ConversationService.DEFAULT_USER_ID;
        PageResponse<ConversationSummaryDto> resp = conversationService.list(userId, page, size, keyword);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/conversations")
    public ResponseEntity<Map<String, Object>> create(@RequestBody(required = false) CreateConversationRequest request) {
        String userId = ConversationService.DEFAULT_USER_ID;
        String title = request != null ? request.getTitle() : null;
        String projectId = request != null ? request.getProjectId() : null;
        String id = conversationService.create(userId, title, projectId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("id", id);
        return ResponseEntity.ok(resp);
    }

    @PatchMapping("/conversations/{conversationId}")
    public ResponseEntity<Void> rename(
            @PathVariable String conversationId,
            @RequestBody RenameConversationRequest request
    ) {
        String userId = ConversationService.DEFAULT_USER_ID;
        conversationService.rename(userId, conversationId, request != null ? request.getTitle() : null);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<Void> delete(@PathVariable String conversationId) {
        String userId = ConversationService.DEFAULT_USER_ID;
        conversationService.delete(userId, conversationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<ConversationMessageDto>> messages(@PathVariable String conversationId) {
        String userId = ConversationService.DEFAULT_USER_ID;
        List<ConversationMessageDto> resp = conversationService.getMessages(userId, conversationId);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markRead(@PathVariable String conversationId) {
        String userId = ConversationService.DEFAULT_USER_ID;
        if (StringUtils.hasText(conversationId)) {
            conversationService.markRead(userId, conversationId);
        }
        return ResponseEntity.ok().build();
    }
}

