package com.liangshou.movie.scripts.service.dto.conversation;

import lombok.Data;

import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> items;
    private long total;
    private int page;
    private int size;
}

