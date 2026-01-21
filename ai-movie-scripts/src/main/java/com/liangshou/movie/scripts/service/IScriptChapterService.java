package com.liangshou.movie.scripts.service;

import com.liangshou.movie.scripts.service.dto.ScriptChapterDTO;
import java.util.List;

/**
 * 剧本章节服务接口
 */
public interface IScriptChapterService {
    ScriptChapterDTO createChapter(ScriptChapterDTO chapterDTO);
    ScriptChapterDTO findById(String id);
    List<ScriptChapterDTO> findByProjectId(String projectId);
    ScriptChapterDTO updateChapter(String id, ScriptChapterDTO chapterDTO);
    void deleteChapter(String id);
    List<ScriptChapterDTO> findByProjectIdAndChapterNumber(String projectId, Integer chapterNumber);
}