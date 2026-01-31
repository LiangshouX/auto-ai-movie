import React, {useEffect, useState} from 'react';
import {Col, message, Row} from 'antd';
import {ScriptProject} from '@/api/types/project-types.ts';
import {projectApi} from '@/api/service/ai-scripts.ts';
import {AiChatPanel} from './AiChatPanel.tsx';
import {TextEditorPanel} from './TextEditorPanel.tsx';
import {
    AiMessage,
    AiThought,
    AiThoughtChain,
    ConversationSession,
    createDefaultMessage,
    createDefaultConversation
} from '@/api/types/ai-chat-types.ts';

interface BackgroundSettingProps {
    project: ScriptProject | null;
    onContentChange: (content: string) => void;
}

const BackgroundSetting: React.FC<BackgroundSettingProps> = ({project, onContentChange}) => {
    const [leftContent, setLeftContent] = useState<string>(project?.theme || '');
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiThoughts, setAiThoughts] = useState<AiThought[]>([]);
    const [aiThoughtChains, setAiThoughtChains] = useState<AiThoughtChain[]>([]);
    const [conversations, setConversations] = useState<ConversationSession[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [, setSaving] = useState<boolean>(false);

    // 初始化session_id和对话历史
    useEffect(() => {
        if (project?.id) {
            const sessionId = `${project.id.substring(0, 16)}-${Date.now()}`;
            setSessionId(sessionId);

            // 创建初始对话
            const initialConversation = createDefaultConversation(project.id, '背景设定讨论');
            setConversations([initialConversation]);
        }
    }, [project]);

    // 当左侧内容变化时，通知父组件
    useEffect(() => {
        onContentChange(leftContent);
    }, [leftContent]);

    const handleSave = async () => {
        if (!project?.id) return;

        try {
            setSaving(true);
            // 更新项目主题字段
            await projectApi.updateProjectTheme(project.id, leftContent);
            message.success('背景设定保存成功！');
        } catch (error) {
            console.error('保存背景设定失败:', error);
            message.error('保存失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    const handleSendToAI = () => {
        if (!inputMessage.trim()) return;

        // 添加用户消息到对话历史
        const userMessage = createDefaultMessage(inputMessage, 'user');
        setAiMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsStreaming(true);

        // 模拟AI思考过程
        setTimeout(() => {
            const thought1 = {
                id: `thought-${Date.now()}-1`,
                content: '分析用户输入的背景设定需求...',
                type: 'analyzing' as const,
                timestamp: Date.now()
            };

            const thought2 = {
                id: `thought-${Date.now()}-2`,
                content: '构思相关的创作建议和扩展方向...',
                type: 'planning' as const,
                timestamp: Date.now() + 500
            };

            setAiThoughts([thought1, thought2]);
        }, 300);

        // 模拟AI执行链
        setTimeout(() => {
            const thoughtChain = {
                id: `chain-${Date.now()}`,
                thoughts: [
                    {
                        id: `sub-thought-${Date.now()}-1`,
                        content: '识别关键要素：世界观、时代背景、主要矛盾',
                        type: 'analyzing' as const,
                        timestamp: Date.now()
                    },
                    {
                        id: `sub-thought-${Date.now()}-2`,
                        content: '构建扩展框架：增加细节描述、深化主题内涵',
                        type: 'planning' as const,
                        timestamp: Date.now() + 200
                    }
                ],
                finalAnswer: `基于您的背景设定"${inputMessage}"，我为您提供了以下创作建议：

1. 可以进一步细化世界观设定
2. 建议增加时代背景的具体描述
3. 可以深入挖掘主要矛盾的核心要素`,
                timestamp: Date.now() + 800
            };

            setAiThoughtChains([thoughtChain]);
        }, 800);

        // 模拟AI最终响应
        setTimeout(() => {
            const aiResponse = createDefaultMessage(
                `感谢您的输入！关于 "${inputMessage}"，我理解这是一个重要的背景设定。

根据您提供的信息，我建议可以从以下几个方面进行扩展：

1. **世界观构建** - 可以增加更多细节描述
2. **时代特色** - 强化背景的时代感和独特性
3. **主题深化** - 挖掘更深层次的故事内核

这样可以让您的背景设定更加丰富和有深度。`,
                'assistant'
            );

            setAiMessages(prev => [...prev, aiResponse]);
            setIsStreaming(false);
            setAiThoughts([]);
            setAiThoughtChains([]);
        }, 1500);
    };

    const handleClearHistory = () => {
        setAiMessages([]);
        setAiThoughts([]);
        setAiThoughtChains([]);
        message.success('对话历史已清空');
    };

    const handleConversationSelect = (conversationId: string) => {
        // 切换对话会话的逻辑
        message.info(`切换到会话: ${conversationId}`);
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            minHeight: 'calc(100vh - 128px)',
            minWidth: 'max(1200px, calc(100vw - 340px))'
        }}>
            <Row gutter={[24, 24]} style={{flex: 1, width: '100%'}}>
                {/* 左侧文本编辑区 */}
                <Col xs={24} md={12} style={{height: '100%'}}>
                    <TextEditorPanel
                        title="背景设定"
                        subtitle="请在此处编写剧本的背景设定内容"
                        value={leftContent}
                        onChange={setLeftContent}
                        placeholder="请输入剧本背景设定..."
                        showSaveButton={true}
                        onSave={handleSave}
                    />
                </Col>

                {/* 右侧AI对话区 */}
                <Col xs={24} md={12} style={{height: '100%'}}>
                    <AiChatPanel
                        title="AI创作助手"
                        subtitle="与AI助手讨论背景设定与创作灵感"
                        sessionId={sessionId}
                        messages={aiMessages}
                        thoughts={aiThoughts}
                        thoughtChains={aiThoughtChains}
                        conversations={conversations}
                        inputMessage={inputMessage}
                        onInputChange={setInputMessage}
                        onSend={handleSendToAI}
                        onClearHistory={handleClearHistory}
                        onConversationSelect={handleConversationSelect}
                        disabledSend={!inputMessage.trim()}
                        isStreaming={isStreaming}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default BackgroundSetting;