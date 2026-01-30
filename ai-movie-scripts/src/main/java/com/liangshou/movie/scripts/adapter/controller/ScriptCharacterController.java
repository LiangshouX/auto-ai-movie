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
@RequestMapping("/api/v1/characters")
public class ScriptCharacterController {

    @Autowired
    private IScriptCharacterSupport scriptCharacterService;

    /**
     * 创建角色
     * 从请求体中获取项目ID
     */
    @PostMapping
    public ResponseEntity<ScriptCharacterDTO> createCharacter(
            @RequestBody ScriptCharacterDTO characterDTO) {
        // 验证请求体中的项目ID是否存在
        if (characterDTO.getProjectId() == null || characterDTO.getProjectId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ScriptCharacterDTO createdCharacter = scriptCharacterService.createCharacter(characterDTO);
        return ResponseEntity.ok(createdCharacter);
    }

    /**
     * 根据ID获取角色
     */
    @PostMapping("/get-by-id")
    public ResponseEntity<ScriptCharacterDTO> getCharacterById(
            @RequestBody ScriptCharacterDTO characterDTO) {
        // 验证请求体中的ID是否存在
        if (characterDTO.getId() == null || characterDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ScriptCharacterDTO character = scriptCharacterService.findById(characterDTO.getId());
        if (character != null) {
            return ResponseEntity.ok(character);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 获取项目的所有角色
     * 从请求体中获取项目ID
     */
    @PostMapping("/list-by-project")
    public ResponseEntity<List<ScriptCharacterDTO>> getCharactersByProjectId(
            @RequestBody ScriptCharacterDTO characterDTO) {
        // 验证请求体中的项目ID是否存在
        if (characterDTO.getProjectId() == null || characterDTO.getProjectId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<ScriptCharacterDTO> characters = scriptCharacterService.findByProjectId(characterDTO.getProjectId());
        return ResponseEntity.ok(characters);
    }

    /**
     * 更新角色
     * 从请求体中获取角色ID进行更新
     */
    @PostMapping("/update")
    public ResponseEntity<ScriptCharacterDTO> updateCharacter(
            @RequestBody ScriptCharacterDTO characterDTO) {
        // 验证请求体中的ID是否存在
        if (characterDTO.getId() == null || characterDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ScriptCharacterDTO updatedCharacter = scriptCharacterService.updateCharacter(characterDTO);
        if (updatedCharacter != null) {
            return ResponseEntity.ok(updatedCharacter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除角色
     * 从请求体中获取角色ID
     */
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteCharacter(
            @RequestBody ScriptCharacterDTO characterDTO) {
        // 验证请求体中的ID是否存在
        if (characterDTO.getId() == null || characterDTO.getId().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        scriptCharacterService.deleteCharacter(characterDTO.getId());
        return ResponseEntity.noContent().build();
    }
}