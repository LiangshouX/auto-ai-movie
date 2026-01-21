package com.liangshou.movie.scripts.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.entity.ScriptProject;
import org.apache.ibatis.annotations.Mapper;

/**
 * 剧本项目数据访问接口
 */
@Mapper
public interface ScriptProjectMapper extends BaseMapper<ScriptProject> {
}