package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptChapterSupport;
import com.liangshou.movie.scripts.service.dto.ScriptChapterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 剧本章节控制器
 */
@RestController
@RequestMapping("/api/v1/script-chapter")
public class ScriptChapterController {

    @Autowired
    private IScriptChapterSupport scriptChapterService;

    /**
     * 创建章节
     * 从请求体中获取项目ID
     */
    @PostMapping
    public ResponseEntity<ScriptChapterDTO> createChapter(@RequestBody ScriptChapterDTO chapterDTO) {
        // 验证请求体中的项目ID是否存在
        if (chapterDTO.getProjectId() == null || chapterDTO.getProjectId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ScriptChapterDTO createdChapter = scriptChapterService.createChapter(chapterDTO);
        return ResponseEntity.ok(createdChapter);
    }

    /**
     * 根据ID获取章节
     * 从请求体中获取章节ID
     */
    @PostMapping("/get-by-id")
    public ResponseEntity<ScriptChapterDTO> getChapterById(@RequestBody ScriptChapterDTO chapterDTO) {
        // 验证请求体中的ID是否存在
        if (chapterDTO.getId() == null || chapterDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ScriptChapterDTO chapter = scriptChapterService.findById(chapterDTO.getId());
        if (chapter != null) {
            return ResponseEntity.ok(chapter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 获取项目的所有章节
     * 从请求体中获取项目ID
     */
    @PostMapping("/list-by-project")
    public ResponseEntity<List<ScriptChapterDTO>> getChaptersByProjectId(@RequestBody ScriptChapterDTO chapterDTO) {
        // 验证请求体中的项目ID是否存在
        if (chapterDTO.getProjectId() == null || chapterDTO.getProjectId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<ScriptChapterDTO> chapters = scriptChapterService.findByProjectId(chapterDTO.getProjectId());
        return ResponseEntity.ok(chapters);
    }

    /**
     * 根据章节号获取特定章节
     * 从请求体中获取项目ID和章节号
     */
    @PostMapping("/list-by-project-and-number")
    public ResponseEntity<List<ScriptChapterDTO>> getChaptersByProjectIdAndChapterNumber(
            @RequestBody ScriptChapterDTO chapterDTO) {
        // 验证请求体中的项目ID和章节号是否存在
        if (chapterDTO.getProjectId() == null || chapterDTO.getProjectId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (chapterDTO.getChapterNumber() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<ScriptChapterDTO> chapters = scriptChapterService.findByProjectIdAndChapterNumber(
            chapterDTO.getProjectId(), 
            chapterDTO.getChapterNumber()
        );
        return ResponseEntity.ok(chapters);
    }

    /**
     * 更新章节
     * 从请求体中获取章节ID进行更新
     */
    @PostMapping("/update")
    public ResponseEntity<ScriptChapterDTO> updateChapter(@RequestBody ScriptChapterDTO chapterDTO) {
        // 验证请求体中的ID是否存在
        if (chapterDTO.getId() == null || chapterDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ScriptChapterDTO updatedChapter = scriptChapterService.updateChapter(chapterDTO.getId(), chapterDTO);
        if (updatedChapter != null) {
            return ResponseEntity.ok(updatedChapter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除章节
     * 从请求体中获取章节ID
     */
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteChapter(@RequestBody ScriptChapterDTO chapterDTO) {
        // 验证请求体中的ID是否存在
        if (chapterDTO.getId() == null || chapterDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        scriptChapterService.deleteChapter(chapterDTO.getId());
        return ResponseEntity.noContent().build();
    }
}