package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptProjectSupport;
import com.liangshou.movie.scripts.service.dto.ScriptProjectDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 剧本项目控制器
 */
@RestController
@RequestMapping("/api/v1/projects")
public class ScriptProjectController {

    @Autowired
    private IScriptProjectSupport scriptProjectService;

    /**
     * 创建新项目
     */
    @PostMapping
    public ResponseEntity<ScriptProjectDTO> createProject(@RequestBody ScriptProjectDTO projectDTO) {
        ScriptProjectDTO createdProject = scriptProjectService.createProject(projectDTO);
        return ResponseEntity.ok(createdProject);
    }

    /**
     * 根据ID获取项目
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScriptProjectDTO> getProjectById(@PathVariable String id) {
        ScriptProjectDTO project = scriptProjectService.findById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 获取所有项目
     */
    @GetMapping
    public ResponseEntity<List<ScriptProjectDTO>> getAllProjects() {
        List<ScriptProjectDTO> projects = scriptProjectService.findAll();
        return ResponseEntity.ok(projects);
    }

    /**
     * 更新项目
     */
    @PutMapping("/{id}")
    public ResponseEntity<ScriptProjectDTO> updateProject(
            @PathVariable String id,
            @RequestBody ScriptProjectDTO projectDTO) {
        ScriptProjectDTO updatedProject = scriptProjectService.updateProject(id, projectDTO);
        if (updatedProject != null) {
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除项目
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        scriptProjectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 更新项目主题
     */
    @PatchMapping("/{id}/theme")
    public ResponseEntity<ScriptProjectDTO> updateProjectTheme(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody) {
        String theme = requestBody.get("theme");
        ScriptProjectDTO updatedProject = scriptProjectService.updateProjectTheme(id, theme);
        if (updatedProject != null) {
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 更新项目摘要
     */
    @PatchMapping("/{id}/summary")
    public ResponseEntity<ScriptProjectDTO> updateProjectSummary(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody) {
        String summary = requestBody.get("summary");
        ScriptProjectDTO updatedProject = scriptProjectService.updateProjectSummary(id, summary);
        if (updatedProject != null) {
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 更新项目状态
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ScriptProjectDTO> updateProjectStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        ScriptProjectDTO updatedProject = scriptProjectService.updateProjectStatus(id, status);
        if (updatedProject != null) {
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}