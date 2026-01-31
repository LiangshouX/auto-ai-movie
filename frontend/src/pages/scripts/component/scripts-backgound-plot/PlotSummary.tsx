import React, {useEffect, useState} from 'react';
import {Col, message, Row} from 'antd';
import {ScriptProject} from '@/api/types/project-types.ts';
import {projectApi} from '@/api/service/ai-scripts.ts';
import {AiChatPanel} from './AiChatPanel.tsx';
import {TextEditorPanel} from './TextEditorPanel.tsx';
import {AiMessage, AiThought, AiThoughtChain, ConversationSession, createDefaultMessage, createDefaultConversation} from '../../../../api/types/ai-chat-types.ts';

interface PlotSummaryProps {
    project: ScriptProject | null;
    onContentChange: (content: string) => void;
}

const PlotSummary: React.FC<PlotSummaryProps> = ({project, onContentChange}) => {
    const [leftContent, setLeftContent] = useState<string>(project?.summary || '');
    const [sessionId, setSessionId] = useState<string>('');
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiThoughts, setAiThoughts] = useState<AiThought[]>([]);
    const [aiThoughtChains, setAiThoughtChains] = useState<AiThoughtChain[]>([]);
    const [conversations, setConversations] = useState<ConversationSession[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [, setSaving] = useState<boolean>(false);

    // 初始化session_id和对话历史
    useEffect(() => {
        if (project?.id) {
            const sessionId = `${project.id}-${Date.now()}`;
            setSessionId(sessionId);
            
            // 创建初始对话
            const initialConversation = createDefaultConversation(project.id, '剧情梗概讨论');
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
            // 更新项目摘要字段
            await projectApi.updateProjectSummary(project.id, leftContent);
            message.success('剧情梗概保存成功！');
        } catch (error) {
            console.error('保存剧情梗概失败:', error);
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
                content: '分析剧情梗概的结构完整性...',
                type: 'analyzing' as const,
                timestamp: Date.now()
            };
            
            const thought2 = {
                id: `thought-${Date.now()}-2`,
                content: '评估故事节奏和吸引力...',
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
                        content: '检查三幕式结构：开端、发展、结局',
                        type: 'analyzing' as const,
                        timestamp: Date.now()
                    },
                    {
                        id: `sub-thought-${Date.now()}-2`,
                        content: '优化情节转折点的设置',
                        type: 'planning' as const,
                        timestamp: Date.now() + 200
                    }
                ],
                finalAnswer: `您的剧情梗概结构清晰，建议加强以下几点：

1. 明确主要冲突的核心
2. 强化关键转折点的戏剧性
3. 完善结局的情感共鸣`,
                timestamp: Date.now() + 800
            };
            
            setAiThoughtChains([thoughtChain]);
        }, 800);

        // 模拟AI最终响应
        setTimeout(() => {
            const aiResponse = createDefaultMessage(
                `关于 "${inputMessage}" 的剧情梗概，我为您提供以下专业建议：

🎯 **结构优化建议**
- 建议采用经典的三幕式结构
- 强化开篇的钩子设计
- 完善高潮部分的戏剧张力

⚡ **节奏把控**
- 合理分配各部分篇幅
- 设置适当的悬念节点
- 保持叙事节奏的紧凑性

这样的调整能让您的剧情更加引人入胜！`,
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
                <Col xs={24} md={12}>
                    <TextEditorPanel
                        title="剧情梗概"
                        subtitle="请在此处编写剧本的剧情梗概内容"
                        value={leftContent}
                        onChange={setLeftContent}
                        placeholder="请输入剧情梗概..."
                        showSaveButton={true}
                        onSave={handleSave}
                    />
                </Col>

                {/* 右侧AI对话区 */}
                <Col xs={24} md={12} style={{height: '100%'}}>
                    <AiChatPanel
                        title="AI剧情顾问"
                        subtitle="与AI助手讨论剧情结构与叙事技巧"
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

export default PlotSummary;