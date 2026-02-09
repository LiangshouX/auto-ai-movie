package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptEpisodeMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptEpisodePO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptEpisodeSupport;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("unused")
public class IScriptEpisodeSupportImpl extends ServiceImpl<ScriptEpisodeMapper, ScriptEpisodePO> implements IScriptEpisodeSupport {
}
