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
@RequestMapping("/api/v1/projects/{projectId}/chapters")
public class ScriptChapterController {

    @Autowired
    private IScriptChapterSupport scriptChapterService;

    /**
     * 创建章节
     */
    @PostMapping
    public ResponseEntity<ScriptChapterDTO> createChapter(
            @PathVariable String projectId,
            @RequestBody ScriptChapterDTO chapterDTO) {
        // 设置项目ID
        chapterDTO.setProjectId(projectId);
        ScriptChapterDTO createdChapter = scriptChapterService.createChapter(chapterDTO);
        return ResponseEntity.ok(createdChapter);
    }

    /**
     * 根据ID获取章节
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScriptChapterDTO> getChapterById(@PathVariable String id) {
        ScriptChapterDTO chapter = scriptChapterService.findById(id);
        if (chapter != null) {
            return ResponseEntity.ok(chapter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 获取项目的所有章节
     */
    @GetMapping
    public ResponseEntity<List<ScriptChapterDTO>> getChaptersByProjectId(@PathVariable String projectId) {
        List<ScriptChapterDTO> chapters = scriptChapterService.findByProjectId(projectId);
        return ResponseEntity.ok(chapters);
    }

    /**
     * 根据章节号获取特定章节
     */
    @GetMapping("/number/{chapterNumber}")
    public ResponseEntity<List<ScriptChapterDTO>> getChaptersByProjectIdAndChapterNumber(
            @PathVariable String projectId,
            @PathVariable Integer chapterNumber) {
        List<ScriptChapterDTO> chapters = scriptChapterService.findByProjectIdAndChapterNumber(projectId, chapterNumber);
        return ResponseEntity.ok(chapters);
    }

    /**
     * 更新章节
     */
    @PutMapping("/{id}")
    public ResponseEntity<ScriptChapterDTO> updateChapter(
            @PathVariable String id,
            @RequestBody ScriptChapterDTO chapterDTO) {
        ScriptChapterDTO updatedChapter = scriptChapterService.updateChapter(id, chapterDTO);
        if (updatedChapter != null) {
            return ResponseEntity.ok(updatedChapter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除章节
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable String id) {
        scriptChapterService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }
}