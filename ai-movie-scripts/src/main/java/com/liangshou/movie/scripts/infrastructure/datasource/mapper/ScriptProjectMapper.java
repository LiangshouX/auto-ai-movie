package com.liangshou.movie.scripts.infrastructure.datasource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptProjectPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 剧本项目数据访问接口
 */
@Mapper
public interface ScriptProjectMapper extends BaseMapper<ScriptProjectPO> {
}