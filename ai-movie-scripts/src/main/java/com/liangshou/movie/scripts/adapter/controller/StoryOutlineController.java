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
@RequestMapping("/api/v1/projects/{projectId}/outline")
public class StoryOutlineController {

    @Autowired
    private IStoryOutlineSupport storyOutlineService;

    /**
     * 获取项目的大纲
     */
    @GetMapping
    public ResponseEntity<StoryOutlineDTO> getOutlineByProjectId(@PathVariable String projectId) {
        Optional<StoryOutlineDTO> outline = storyOutlineService.findByProjectId(projectId);
        if (outline.isPresent()) {
            return ResponseEntity.ok(outline.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 创建或更新项目大纲
     */
    @PostMapping
    public ResponseEntity<StoryOutlineDTO> createOrUpdateOutline(
            @PathVariable String projectId,
            @RequestBody StoryOutlineDTO outlineDTO) {
        // 设置项目ID
        outlineDTO.setProjectId(projectId);
        
        // 检查是否已存在大纲
        Optional<StoryOutlineDTO> existingOutline = storyOutlineService.findByProjectId(projectId);
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
     */
    @PutMapping("/{id}")
    public ResponseEntity<StoryOutlineDTO> updateOutline(
            @PathVariable String id,
            @RequestBody StoryOutlineDTO outlineDTO) {
        StoryOutlineDTO updatedOutline = storyOutlineService.updateOutline(id, outlineDTO);
        if (updatedOutline != null) {
            return ResponseEntity.ok(updatedOutline);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除项目大纲
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutline(@PathVariable String id) {
        storyOutlineService.deleteOutline(id);
        return ResponseEntity.noContent().build();
    }
}