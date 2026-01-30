package com.liangshou.movie.scripts.utils.scripts;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * 数组与JSON相互转换工具类
 * 用于处理String数组与JSON字符串之间的转换
 */
@SuppressWarnings("unused")
public class ArrayJsonUtil {

    private ArrayJsonUtil() {
        // Do Nothing
    }

    // Jackson ObjectMapper实例
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(ArrayJsonUtil.class);

    /**
     * 将String数组转换为JSON字符串
     *
     * @param array String数组
     * @return JSON字符串，如果输入为null则返回"[]"
     */
    public static String arrayToJson(String[] array) {
        if (array == null || array.length == 0) {
            return "[]";
        }

        try {
            return objectMapper.writeValueAsString(Arrays.asList(array));
        } catch (JsonProcessingException e) {
            // 记录错误并返回空数组
            log.error("Error serializing String array to JSON: {}", e.getMessage(), e);
            return "[]";
        }
    }

    /**
     * 将List<String>转换为JSON字符串
     *
     * @param list String列表
     * @return JSON字符串，如果输入为null则返回"[]"
     */
    public static String listToJson(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }

        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            // 记录错误并返回空数组
            log.error("Error serializing String list to JSON: {}", e.getMessage(), e);
            return "[]";
        }
    }

    /**
     * 将JSON字符串转换为String数组
     *
     * @param json JSON字符串
     * @return String数组，如果解析失败则返回空数组
     */
    public static String[] jsonToArray(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new String[0];
        }

        try {
            List<String> list = objectMapper.readValue(json, new TypeReference<>() {
            });
            return list.toArray(new String[0]);
        } catch (JsonProcessingException e) {
            // 记录错误并返回空数组
            log.error("Error deserializing JSON to String array: {}", e.getMessage(), e);
            return new String[0];
        }
    }

    /**
     * 将JSON字符串转换为String列表
     *
     * @param json JSON字符串
     * @return String列表，如果解析失败则返回空列表
     */
    public static List<String> jsonToList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            // 记录错误并返回空列表
            log.error("Error deserializing JSON to String list: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * 验证JSON字符串是否为有效的数组格式
     *
     * @param json JSON字符串
     * @return 是否为有效数组
     */
    public static boolean isValidJsonArray(String json) {
        if (json == null || json.trim().isEmpty()) {
            return true; // 空字符串被认为是有效的空数组
        }

        try {
            objectMapper.readTree(json);
            return json.trim().startsWith("[") && json.trim().endsWith("]");
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}