package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptProjectPO;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptProjectMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptProjectSupport;
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
public class ScriptProjectSupportImpl extends ServiceImpl<ScriptProjectMapper, ScriptProjectPO> implements IScriptProjectSupport {

    @Override
    public ScriptProjectDTO createProject(ScriptProjectDTO projectDTO) {
        ScriptProjectPO entity = new ScriptProjectPO();
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
        ScriptProjectPO entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        ScriptProjectDTO dto = new ScriptProjectDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Override
    public List<ScriptProjectDTO> findAll() {
        List<ScriptProjectPO> entities = this.list();
        return entities.stream().map(entity -> {
            ScriptProjectDTO dto = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ScriptProjectDTO updateProject(String id, ScriptProjectDTO projectDTO) {
        ScriptProjectPO entity = this.getById(id);
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
        ScriptProjectPO entity = this.getById(id);
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
        ScriptProjectPO entity = this.getById(id);
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
        ScriptProjectPO entity = this.getById(id);
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