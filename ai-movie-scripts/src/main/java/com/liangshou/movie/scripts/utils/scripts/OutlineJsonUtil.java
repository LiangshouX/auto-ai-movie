package com.liangshou.movie.scripts.utils.scripts;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.liangshou.movie.scripts.service.dto.outline.OutlineSectionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

/**
 * 大纲JSON数据转换工具类
 * 用于处理大纲章节结构与JSON字符串之间的转换
 */
@SuppressWarnings("unused")
public class OutlineJsonUtil {

    private OutlineJsonUtil() {
        // Do Nothing
    }

    // Jackson ObjectMapper实例
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(OutlineJsonUtil.class);

    /**
     * 将大纲章节列表转换为JSON字符串
     *
     * @param sections 大纲章节列表
     * @return JSON字符串，如果输入为null则返回"[]"
     */
    public static String sectionsToJson(List<OutlineSectionDTO> sections) {
        if (sections == null || sections.isEmpty()) {
            return "[]";
        }

        try {
            objectMapper.registerModule(new JavaTimeModule());
            return objectMapper.writeValueAsString(sections);
        } catch (JsonProcessingException e) {
            // 记录错误并返回空数组
            log.error("Error serializing outline sections to JSON: {}", e.getMessage(), e);
            return "[]";
        }
    }

    /**
     * 将JSON字符串转换为大纲章节列表
     *
     * @param json JSON字符串
     * @return 大纲章节列表，如果解析失败则返回空列表
     */
    public static List<OutlineSectionDTO> jsonToSections(String json) {
        if (json == null || json.trim().isEmpty()) {
            return Collections.emptyList();
        }

        try {
            objectMapper.registerModule(new JavaTimeModule());
            return objectMapper.readValue(json, new TypeReference<List<OutlineSectionDTO>>() {
            });
        } catch (JsonProcessingException e) {
            // 记录错误并返回空列表
            log.error("Error deserializing JSON to outline sections: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * 验证JSON字符串是否为有效的大纲章节数组格式
     *
     * @param json JSON字符串
     * @return 是否为有效数组
     */
    public static boolean isValidSectionsJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return true; // 空字符串被认为是有效的空数组
        }

        try {
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.readTree(json);
            return json.trim().startsWith("[") && json.trim().endsWith("]");
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}