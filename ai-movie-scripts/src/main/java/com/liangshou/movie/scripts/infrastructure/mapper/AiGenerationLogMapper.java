package com.liangshou.movie.scripts.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.entity.AiGenerationLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * AI生成日志数据访问接口
 */
@Mapper
public interface AiGenerationLogMapper extends BaseMapper<AiGenerationLog> {
}