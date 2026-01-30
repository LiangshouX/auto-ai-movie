package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.infrastructure.datasource.support.IStoryOutlineSupport;
import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

/**
 * 故事大纲控制器
 */
@RestController
@RequestMapping("/api/v1/story-outline")
public class StoryOutlineController {

    @Autowired
    private IStoryOutlineSupport storyOutlineService;

    /**
     * 获取项目的大纲
     * 从请求体中获取项目ID
     */
    @PostMapping("/get-by-project")
    public ResponseEntity<StoryOutlineDTO> getOutlineByProjectId(@RequestBody StoryOutlineDTO outlineDTO) {
        // 验证请求体中的项目ID是否存在
        if (outlineDTO.getProjectId() == null || outlineDTO.getProjectId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Optional<StoryOutlineDTO> outline = storyOutlineService.findByProjectId(outlineDTO.getProjectId());
        if (outline.isPresent()) {
            return ResponseEntity.ok(outline.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 创建或更新项目大纲
     * 从请求体中获取项目ID
     */
    @PostMapping
    public ResponseEntity<StoryOutlineDTO> createOrUpdateOutline(@RequestBody StoryOutlineDTO outlineDTO) {
        // 验证请求体中的项目ID是否存在
        if (outlineDTO.getProjectId() == null || outlineDTO.getProjectId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // 检查是否已存在大纲
        Optional<StoryOutlineDTO> existingOutline = storyOutlineService.findByProjectId(outlineDTO.getProjectId());
        StoryOutlineDTO result;
        if (existingOutline.isPresent()) {
            // 如果存在，则更新
            result = storyOutlineService.updateOutline(existingOutline.get().getId(), outlineDTO);
        } else {
            // 如果不存在，则创建
            result = storyOutlineService.createOutline(outlineDTO);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 更新项目大纲
     * 从请求体中获取大纲ID进行更新
     */
    @PostMapping("/update")
    public ResponseEntity<StoryOutlineDTO> updateOutline(@RequestBody StoryOutlineDTO outlineDTO) {
        // 验证请求体中的ID是否存在
        if (outlineDTO.getId() == null || outlineDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        StoryOutlineDTO updatedOutline = storyOutlineService.updateOutline(outlineDTO.getId(), outlineDTO);
        if (updatedOutline != null) {
            return ResponseEntity.ok(updatedOutline);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除项目大纲
     * 从请求体中获取大纲ID
     */
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteOutline(@RequestBody StoryOutlineDTO outlineDTO) {
        // 验证请求体中的ID是否存在
        if (outlineDTO.getId() == null || outlineDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        storyOutlineService.deleteOutline(outlineDTO.getId());
        return ResponseEntity.noContent().build();
    }
}