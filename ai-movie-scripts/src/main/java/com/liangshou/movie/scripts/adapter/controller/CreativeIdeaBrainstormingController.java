package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.service.agents.agentimpl.CreativeIdeaBrainstormingAgent;
import com.liangshou.movie.scripts.service.dto.brainstorm.BrainstormChatRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/brainstorming")
public class CreativeIdeaBrainstormingController {

    private final CreativeIdeaBrainstormingAgent brainstormingAgent;

    public CreativeIdeaBrainstormingController(CreativeIdeaBrainstormingAgent brainstormingAgent) {
        this.brainstormingAgent = brainstormingAgent;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody BrainstormChatRequest request) {
        String conversationId = StringUtils.hasText(request.getConversationId())
                ? request.getConversationId()
                : UUID.randomUUID().toString();
        boolean enableSearch = request.getEnableSearch() == null || request.getEnableSearch();

        String result = brainstormingAgent.chat(conversationId, request.getMessage(), enableSearch);

        Map<String, Object> resp = new HashMap<>();
        resp.put("conversationId", conversationId);
        resp.put("result", result);
        return ResponseEntity.ok(resp);
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chatStream(@RequestBody BrainstormChatRequest request) {
        String conversationId = StringUtils.hasText(request.getConversationId())
                ? request.getConversationId()
                : UUID.randomUUID().toString();
        boolean enableSearch = request.getEnableSearch() == null || request.getEnableSearch();

        SseEmitter emitter = new SseEmitter(0L);
        try {
            emitter.send(SseEmitter.event().name("conversation").data(conversationId));
        } catch (IOException e) {
            emitter.completeWithError(e);
            return emitter;
        }

        Flux<String> flux = brainstormingAgent.chatStream(conversationId, request.getMessage(), enableSearch);
        flux.subscribe(
                chunk -> {
                    try {
                        emitter.send(SseEmitter.event().name("delta").data(chunk));
                    } catch (IOException e) {
                        emitter.completeWithError(e);
                    }
                },
                emitter::completeWithError,
                () -> {
                    try {
                        emitter.send(SseEmitter.event().name("done").data("[DONE]"));
                    } catch (IOException ignored) {
                    }
                    emitter.complete();
                }
        );

        return emitter;
    }

    @PostMapping("/clear")
    public ResponseEntity<Void> clear(@RequestBody Map<String, String> request) {
        String conversationId = request.get("conversationId");
        brainstormingAgent.clear(conversationId);
        return ResponseEntity.ok().build();
    }
}
