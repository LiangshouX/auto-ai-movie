package com.liangshou.movie.scripts.infrastructure.datasource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptCharacterPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 角色信息数据访问接口
 */
@Mapper
public interface ScriptCharacterMapper extends BaseMapper<ScriptCharacterPO> {
}