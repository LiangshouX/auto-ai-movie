package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptCharacterSupport;
import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 角色信息控制器
 */
@RestController
@RequestMapping("/api/v1/projects/{projectId}/characters")
public class ScriptCharacterController {

    @Autowired
    private IScriptCharacterSupport scriptCharacterService;

    /**
     * 创建角色
     */
    @PostMapping
    public ResponseEntity<ScriptCharacterDTO> createCharacter(
            @PathVariable String projectId,
            @RequestBody ScriptCharacterDTO characterDTO) {
        // 设置项目ID
        characterDTO.setProjectId(projectId);
        ScriptCharacterDTO createdCharacter = scriptCharacterService.createCharacter(characterDTO);
        return ResponseEntity.ok(createdCharacter);
    }

    /**
     * 根据ID获取角色
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScriptCharacterDTO> getCharacterById(@PathVariable String id) {
        ScriptCharacterDTO character = scriptCharacterService.findById(id);
        if (character != null) {
            return ResponseEntity.ok(character);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 获取项目的所有角色
     */
    @GetMapping
    public ResponseEntity<List<ScriptCharacterDTO>> getCharactersByProjectId(@PathVariable String projectId) {
        List<ScriptCharacterDTO> characters = scriptCharacterService.findByProjectId(projectId);
        return ResponseEntity.ok(characters);
    }

    /**
     * 更新角色
     */
    @PutMapping("/{id}")
    public ResponseEntity<ScriptCharacterDTO> updateCharacter(
            @PathVariable String id,
            @RequestBody ScriptCharacterDTO characterDTO) {
        ScriptCharacterDTO updatedCharacter = scriptCharacterService.updateCharacter(id, characterDTO);
        if (updatedCharacter != null) {
            return ResponseEntity.ok(updatedCharacter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除角色
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable String id) {
        scriptCharacterService.deleteCharacter(id);
        return ResponseEntity.noContent().build();
    }
}