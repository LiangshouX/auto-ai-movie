package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptProjectMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptProjectPO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptProjectSupport;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("unused")
public class IScriptProjectSupportImpl extends ServiceImpl<ScriptProjectMapper, ScriptProjectPO> implements IScriptProjectSupport {
}
