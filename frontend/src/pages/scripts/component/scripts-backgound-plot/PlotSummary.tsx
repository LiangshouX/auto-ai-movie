import React, {useEffect, useMemo, useState} from 'react';
import {Col, message, Row} from 'antd';
import {ScriptProject} from '@/api/types/project-types.ts';
import {AiChatPanel} from './AiChatPanel.tsx';
import {TextEditorPanel} from './TextEditorPanel.tsx';
import {AiMessage, AiThought, AiThoughtChain, ConversationSession, createDefaultMessage, createDefaultConversation} from '@/api/types/ai-chat-types.ts';

interface PlotSummaryProps {
    project: ScriptProject | null;
    onContentChange: (content: string) => void;
}

const PlotSummary: React.FC<PlotSummaryProps> = ({project, onContentChange}) => {
    const layoutScopeAttrValue = useMemo(() => `plot-summary-${Math.random().toString(36).slice(2)}`, [])
    const [leftContent, setLeftContent] = useState<string>(project?.summary || '');
    const [sessionId, setSessionId] = useState<string>('');
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiThoughts, setAiThoughts] = useState<AiThought[]>([]);
    const [aiThoughtChains, setAiThoughtChains] = useState<AiThoughtChain[]>([]);
    const [conversations, setConversations] = useState<ConversationSession[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    // const [, setSaving] = useState<boolean>(false);
    const timerIdsRef = React.useRef<number[]>([]);

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
    }, [leftContent, onContentChange]);

    useEffect(() => {
        return () => {
            timerIdsRef.current.forEach((id) => window.clearTimeout(id));
            timerIdsRef.current = [];
        };
    }, []);

    /*@ts-ignore*/
    // const handleSave = async () => {
    //     if (!project?.id) return;
    //
    //     try {
    //         setSaving(true);
    //         // 更新项目摘要字段
    //         await projectApi.updateProjectSummary(project.id, leftContent);
    //         message.success('剧情梗概保存成功！');
    //     } catch (error) {
    //         console.error('保存剧情梗概失败:', error);
    //         message.error('保存失败，请重试');
    //     } finally {
    //         setSaving(false);
    //     }
    // };

    const handleCancel = () => {
        timerIdsRef.current.forEach((id) => window.clearTimeout(id));
        timerIdsRef.current = [];
        setIsStreaming(false);
        setAiThoughts([]);
        setAiThoughtChains([]);
    };

    const handleSendToAI = (messageText: string) => {
        const trimmed = messageText.trim();
        if (!trimmed) return;

        // 添加用户消息到对话历史
        const userMessage = createDefaultMessage(trimmed, 'user');
        setAiMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsStreaming(true);

        // 模拟AI思考过程
        timerIdsRef.current.push(window.setTimeout(() => {
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
        }, 300));

        // 模拟AI执行链
        timerIdsRef.current.push(window.setTimeout(() => {
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
        }, 800));

        // 模拟AI最终响应
        timerIdsRef.current.push(window.setTimeout(() => {
            const aiResponse = createDefaultMessage(
                `关于 "${trimmed}" 的剧情梗概，我为您提供以下专业建议：

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
        }, 1500));
    };

    const handleClearHistory = () => {
        setAiMessages([]);
        setAiThoughts([]);
        setAiThoughtChains([]);
    };

    const handleConversationSelect = (conversationId: string) => {
        // 切换对话会话的逻辑
        message.info(`切换到会话: ${conversationId}`);
    };



    return (
        <div data-layout-scope={layoutScopeAttrValue} style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
            width: '100%'
        }}>
            <style>{`
                [data-layout-scope="${layoutScopeAttrValue}"] .bg-row {
                    overflow: hidden;
                }
                @media (max-width: 767px) {
                    [data-layout-scope="${layoutScopeAttrValue}"] .bg-row {
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        overscroll-behavior: contain;
                    }
                }
            `}</style>
            <Row className="bg-row" gutter={[24, 24]} style={{flex: 1, height: '100%', width: '100%', minHeight: 0, alignItems: 'stretch'}}>
                {/* 左侧文本编辑区 */}
                <Col xs={24} md={12} style={{height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                    <TextEditorPanel
                        // title="剧情梗概"
                        // subtitle="请在此处编写剧本的剧情梗概内容"
                        value={leftContent}
                        onChange={setLeftContent}
                        placeholder="请在此处编写剧本的剧情梗概内容..."
                        // showSaveButton={true}
                        // onSave={handleSave}
                    />
                </Col>

                {/* 右侧AI对话区 */}
                <Col xs={24} md={12} style={{height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
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
                        onCancel={handleCancel}
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
