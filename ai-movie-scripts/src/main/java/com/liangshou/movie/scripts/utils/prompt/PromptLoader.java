package com.liangshou.movie.scripts.utils.prompt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 提示词加载工具，加载resources/prompts目录下的 PromptTemplate
 */
@SuppressWarnings("unused")
public class PromptLoader {
    private static final Logger logger = LoggerFactory.getLogger(PromptLoader.class);

    private static final String PROMPT_PATH_PREFIX = "prompts/";

    private static final ConcurrentHashMap<String, String> promptCache = new ConcurrentHashMap<>();

    private PromptLoader() {
        // Do Nothing
    }

    public static String loadPrompt(String promptName) {
        return promptCache.computeIfAbsent(promptName, name -> {
            String fileName = PROMPT_PATH_PREFIX + name + ".txt";

            // 使用本类的类加载器获取资源（避免jar包中无法获取资源）
            try (InputStream inputStream = PromptLoader.class.getClassLoader().getResourceAsStream(fileName)) {
                return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            }
            catch (IOException exception) {
                logger.error("加载提示词失败！{}", exception.getMessage(), exception);
                throw new RuntimeException("加载提示词失败: " + name, exception);
            }
        });
    }

    /**
     * 清空 prompt 缓存
     */
    public static void clearCache() {
        promptCache.clear();
    }

    /**
     * 获取 prompt 缓存大小
     * @return 缓存中的 prompt 数量
     */
    public static int getCacheSize() {
        return promptCache.size();
    }

}
