package com.liangshou.movie.scripts.utils.prompt;

import com.liangshou.movie.scripts.common.exceptions.BizException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;

import static com.liangshou.movie.scripts.common.enums.ErrorCodeEnum.PROMPT_LOADER_ERROR;

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
        return promptCache.computeIfAbsent(promptName, PromptLoader::loadPromptFromFile);
    }

    /**
     * 从文件加载指定名称的 Prompt
     *
     * @param promptName prompt 名称
     * @return prompt 内容
     */
    private static String loadPromptFromFile(String promptName) {
        // 步骤1: 记录正在加载的 prompt 名称
        logger.info("开始加载 prompt: {}", promptName);

        // 步骤2: 构造文件路径
        String fileName = PROMPT_PATH_PREFIX + promptName + ".txt";
        logger.debug("构造的文件路径: {}", fileName);

        // 步骤3: 从类加载器获取资源流
        try (InputStream inputStream = PromptLoader.class.getClassLoader().getResourceAsStream(fileName)) {
            if (inputStream == null) {
                logger.error("找不到 prompt 文件: {}", fileName);
                throw new BizException(PROMPT_LOADER_ERROR);
            }
            
            // 步骤4: 读取并转换为字符串
            String content = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            logger.info("成功加载 prompt: {}, 内容长度: {}", promptName, content.length());
            
            return content;
        } catch (IOException exception) {
            logger.error("加载 prompt 文件失败: {}", fileName);
            throw new BizException(PROMPT_LOADER_ERROR, exception);
        }
    }

    /**
     * 清空 prompt 缓存
     */
    public static void clearCache() {
        promptCache.clear();
    }

    /**
     * 获取 prompt 缓存大小
     *
     * @return 缓存中的 prompt 数量
     */
    public static int getCacheSize() {
        return promptCache.size();
    }

}
