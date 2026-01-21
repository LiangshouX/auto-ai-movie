package com.liangshou.movie.scripts.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.entity.ScriptChapter;
import org.apache.ibatis.annotations.Mapper;

/**
 * 剧本章节数据访问接口
 */
@Mapper
public interface ScriptChapterMapper extends BaseMapper<ScriptChapter> {
}