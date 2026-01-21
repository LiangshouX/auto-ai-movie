package com.liangshou.movie.scripts.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.entity.CharacterRelationship;
import org.apache.ibatis.annotations.Mapper;

/**
 * 角色关系数据访问接口
 */
@Mapper
public interface CharacterRelationshipMapper extends BaseMapper<CharacterRelationship> {
}