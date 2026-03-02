package com.liangshou.movie.scripts.service.dto.conversation;

import lombok.Data;

@Data
public class ConversationMessageDto {
    private String role;
    private String content;
    private long timestamp;
}

