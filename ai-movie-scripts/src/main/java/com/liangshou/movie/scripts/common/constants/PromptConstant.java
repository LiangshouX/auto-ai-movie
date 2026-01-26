package com.liangshou.movie.scripts.common.constants;

import com.liangshou.movie.scripts.utils.prompt.PromptLoader;
import org.springframework.ai.chat.prompt.PromptTemplate;

/**
 * 动态加载 resources 中的 prompt 为 PromptTemplate 常量
 */
@SuppressWarnings("unused")
public class PromptConstant {

    private PromptConstant() {
        // Do Nothing
    }

    /**
     * 剧本创意-头脑风暴
     */
    public static PromptTemplate getCreativePrompt() {
        return new PromptTemplate(PromptLoader.loadPrompt("01_creative_idea_brainstorming"));
    }

    /**
     * 背景写作
     */
    public static PromptTemplate getBackgroundWritingPrompt() {
        return new PromptTemplate(PromptLoader.loadPrompt("02_background_writing"));
    }

    /**
     * 情节写作
     */
    public static PromptTemplate getPlotWritingPrompt() {
        return new PromptTemplate(PromptLoader.loadPrompt("03_plot_writing"));
    }

    /**
     * 角色设计
     */
    public static PromptTemplate getCharacterDesignPrompt() {
        return new PromptTemplate(PromptLoader.loadPrompt("04_character_design"));
    }

    /**
     * 大纲写作
     */
    public static PromptTemplate getOutlineWritingPrompt() {
        return new PromptTemplate(PromptLoader.loadPrompt("05_outline_writing"));
    }

    /**
     * 第一章写作
     */
    public static PromptTemplate getChapter1WritingPrompt() {
        return new PromptTemplate(PromptLoader.loadPrompt("06_chapter1_writing"));
    }

    /**
     * 完整章节写作
     */
    public static PromptTemplate getFullChapterWritingPrompt() {
        return new PromptTemplate(PromptLoader.loadPrompt("07_full_chapter_writing"));
    }
}
