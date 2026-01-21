package com.liangshou.movie.scripts.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.entity.ScriptProject;
import com.liangshou.movie.scripts.infrastructure.mapper.ScriptProjectMapper;
import com.liangshou.movie.scripts.service.IScriptProjectService;
import com.liangshou.movie.scripts.service.dto.ScriptProjectDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 剧本项目服务实现类
 */
@Service
public class ScriptProjectServiceImpl extends ServiceImpl<ScriptProjectMapper, ScriptProject> implements IScriptProjectService {

    @Override
    public ScriptProjectDTO createProject(ScriptProjectDTO projectDTO) {
        ScriptProject entity = new ScriptProject();
        BeanUtils.copyProperties(projectDTO, entity);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        this.save(entity);

        ScriptProjectDTO result = new ScriptProjectDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public ScriptProjectDTO findById(String id) {
        ScriptProject entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        ScriptProjectDTO dto = new ScriptProjectDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Override
    public List<ScriptProjectDTO> findAll() {
        List<ScriptProject> entities = this.list();
        return entities.stream().map(entity -> {
            ScriptProjectDTO dto = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ScriptProjectDTO updateProject(String id, ScriptProjectDTO projectDTO) {
        ScriptProject entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        BeanUtils.copyProperties(projectDTO, entity);
        entity.setId(id); // 确保ID不变
        entity.setUpdatedAt(LocalDateTime.now());
        this.updateById(entity);

        ScriptProjectDTO result = new ScriptProjectDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public void deleteProject(String id) {
        this.removeById(id);
    }

    @Override
    public ScriptProjectDTO updateProjectTheme(String id, String theme) {
        ScriptProject entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        entity.setTheme(theme);
        entity.setUpdatedAt(LocalDateTime.now());
        this.updateById(entity);

        ScriptProjectDTO dto = new ScriptProjectDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Override
    public ScriptProjectDTO updateProjectSummary(String id, String summary) {
        ScriptProject entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        entity.setSummary(summary);
        entity.setUpdatedAt(LocalDateTime.now());
        this.updateById(entity);

        ScriptProjectDTO dto = new ScriptProjectDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Override
    public ScriptProjectDTO updateProjectStatus(String id, String status) {
        ScriptProject entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        entity.setStatus(status);
        entity.setUpdatedAt(LocalDateTime.now());
        this.updateById(entity);

        ScriptProjectDTO dto = new ScriptProjectDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}