package com.liangshou.movie.scripts.service.dto.brainstorm;

import lombok.Data;

@Data
public class BrainstormChatRequest {
    private String conversationId;
    private String message;
    private Boolean enableSearch;
}
