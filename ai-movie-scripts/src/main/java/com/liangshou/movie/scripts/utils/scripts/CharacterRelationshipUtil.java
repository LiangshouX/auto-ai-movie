package com.liangshou.movie.scripts.utils.scripts;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.liangshou.movie.scripts.service.dto.CharacterRelationshipDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Collections;

@SuppressWarnings("unused")
public class CharacterRelationshipUtil {

    private CharacterRelationshipUtil() {
        // Do Nothing
    }

    // Jackson ObjectMapper实例
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(CharacterRelationshipUtil.class);

    /**
     * 将单个角色关系对象转换为JSON字符串
     *
     * @param relationship 单个角色关系对象
     * @return JSON字符串，如果输入为null则返回"null"
     */
    public static String toJson(CharacterRelationshipDTO relationship) {
        if (relationship == null) {
            return "null";
        }

        try {
            return objectMapper.writeValueAsString(relationship);
        } catch (JsonProcessingException e) {
            // 记录错误并返回null
            log.error("Error serializing CharacterRelationshipDTO to JSON: {}", e.getMessage(), e);
            return "null";
        }
    }

    /**
     * 将角色关系对象列表转换为JSON字符串
     *
     * @param relationships 角色关系对象列表
     * @return JSON字符串，如果输入为null则返回"[]"
     */
    public static String toJson(List<CharacterRelationshipDTO> relationships) {
        if (relationships == null || relationships.isEmpty()) {
            return "[]";
        }

        try {
            return objectMapper.writeValueAsString(relationships);
        } catch (JsonProcessingException e) {
            // 记录错误并返回空数组
            log.error("Error serializing CharacterRelationshipDTO list to JSON: {}", e.getMessage(), e);
            return "[]";
        }
    }

    /**
     * 将JSON字符串转换为单个角色关系对象
     *
     * @param json JSON字符串
     * @return 角色关系对象，如果解析失败则返回null
     */
    public static CharacterRelationshipDTO fromJsonSingle(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }

        try {
            return objectMapper.readValue(json, CharacterRelationshipDTO.class);
        } catch (JsonProcessingException e) {
            // 记录错误并返回null
            log.error("Error deserializing JSON to CharacterRelationshipDTO: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 将JSON字符串转换为角色关系对象列表
     *
     * @param json JSON字符串
     * @return 角色关系对象列表，如果解析失败则返回空列表
     */
    public static List<CharacterRelationshipDTO> fromJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(json, new TypeReference<List<CharacterRelationshipDTO>>() {
            });
        } catch (JsonProcessingException e) {
            // 记录错误并返回空列表
            log.error("Error deserializing JSON to CharacterRelationshipDTO list: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}