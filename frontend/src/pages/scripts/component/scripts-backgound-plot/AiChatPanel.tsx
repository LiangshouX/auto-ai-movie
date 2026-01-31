import React from 'react';
import {Card, Flex, Tag, Typography} from 'antd';
import {XProvider, Bubble, Welcome, Actions, Conversations, Think, ThoughtChain} from '@ant-design/x';
import {SendOutlined, RobotOutlined, UserOutlined, HistoryOutlined, ClearOutlined} from '@ant-design/icons';
import {AiMessage, AiThought, AiThoughtChain, ConversationSession} from '@/api/types/ai-chat-types.ts';

const {Title, Text} = Typography;

interface AiChatPanelProps {
    title: string;
    subtitle: string;
    sessionId?: string;
    messages: AiMessage[];
    thoughts?: AiThought[];
    thoughtChains?: AiThoughtChain[];
    conversations?: ConversationSession[];
    inputMessage: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    onClearHistory?: () => void;
    onConversationSelect?: (conversationId: string) => void;
    disabledSend?: boolean;
    isStreaming?: boolean;
}

export const AiChatPanel: React.FC<AiChatPanelProps> = (
    {
        title,
        subtitle,
        sessionId,
        messages,
        thoughts = [],
        thoughtChains = [],
        conversations = [],
        inputMessage,
        onInputChange,
        onSend,
        // onClearHistory, // 暂时注释未使用的参数
        // onConversationSelect, // 暂时注释未使用的参数
        disabledSend = false,
        // isStreaming = false // 暂时注释未使用的参数
    }
) => {
    const activeTab = 'chat'; // 固定显示聊天界面

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    // 配置Ant Design X主题
    const xTheme = {
        token: {
            colorPrimary: '#1677ff',
            colorBgContainer: '#ffffff',
            colorText: '#1d1d1d',
            fontSize: 14,
            borderRadius: 8,
        },
        components: {
            Bubble: {
                colorUser: '#1677ff',
                colorAssistant: '#f0f0f0',
                borderRadius: 16,
            },
            Welcome: {
                colorBg: '#fafafa',
                colorText: '#8c8c8c',
            },
        },
    };

    return (
        <XProvider theme={xTheme}>
            <Card
                title={
                    <div>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Title level={4} style={{margin: 0}}>{title}</Title>
                            </div>
                            {sessionId && (
                                <Text type="secondary">
                                    会话ID: <Tag color={'#10b981'}>{sessionId.substring(0, 32)}</Tag>
                                </Text>
                            )}
                        </Flex>
                        <Text type="secondary">{subtitle}</Text>
                    </div>
                }
                style={{height: '100%'}}
                extra={
                    <Actions
                        items={[
                            {
                                key: 'history',
                                icon: <HistoryOutlined/>,
                                label: '对话历史',
                                // onClick: () => setActiveTab('history'), // 暂时注释
                            },
                            {
                                key: 'clear',
                                icon: <ClearOutlined/>,
                                label: '清空历史',
                                // onClick: onClearHistory, // 暂时注释
                                danger: true,
                            },
                        ]}
                    />
                }
            >
                <Flex vertical style={{
                    height: 'calc(100% - 80px)',
                    justifyContent: 'space-between'
                }}>
                    {/* 主要内容区域 */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        marginBottom: 16,
                        minHeight: 'calc(100vh - 300px)',
                        maxHeight: 'calc(100vh - 300px)'
                    }}>
                        {activeTab === 'chat' ? (
                            messages.length === 0 ? (
                                <Welcome
                                    title="欢迎使用AI创作助手"
                                    description="您可以输入问题或想法，AI将为您提供专业的创作建议和灵感启发"
                                    icon={<RobotOutlined style={{fontSize: 48, color: '#1677ff'}}/>}
                                />
                            ) : (
                                <Flex vertical gap={16}>
                                    {/* 渲染对话气泡 */}
                                    {messages.map((message) => (
                                        <Bubble
                                            key={message.id}
                                            placement={message.role === 'user' ? 'end' : 'start'}
                                            avatar={message.role === 'assistant' ? <RobotOutlined/> : <UserOutlined/>}
                                            content={message.text}
                                            variant={message.role === 'user' ? 'filled' : 'outlined'}
                                        />
                                    ))}

                                    {/* 渲染思考过程 */}
                                    {thoughts.map((thought) => (
                                        <Think
                                            key={thought.id}
                                            content={thought.content}
                                            // type={thought.type} // 暂时移除type属性，使用默认值
                                            // timestamp={thought.timestamp} // 暂时移除timestamp属性
                                        />
                                    ))}

                                    {/* 渲染执行链 */}
                                    {thoughtChains.map((chain) => (
                                        <ThoughtChain
                                            key={chain.id}
                                            // thoughts={chain.thoughts} // 暂时移除thoughts属性
                                            content={chain.finalAnswer}
                                            // timestamp={chain.timestamp} // 暂时移除timestamp属性
                                        />
                                    ))}
                                </Flex>
                            )
                        ) : (
                            /* 对话历史管理 */
                            <Conversations
                                items={conversations.map(conv => ({
                                    key: conv.id,
                                    title: conv.title,
                                    description: `${conv.messageCount} 条消息`,
                                    datetime: new Date(conv.updatedAt).toLocaleString(),
                                }))}
                                onSelect={(keys) => {
                                    if (Array.isArray(keys) && keys.length > 0) {
                                        // onConversationSelect?.(keys[0]); // 暂时注释
                                        console.log('Selected conversation:', keys[0]);
                                    }
                                }}
                                activeKey={sessionId}
                            />
                        )}
                    </div>

                    {/* 输入区域 */}
                    <Flex gap={8}>
                        <textarea
                            value={inputMessage}
                            onChange={(e) => onInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="输入您的问题或想法..."
                            rows={3}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '8px',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                            aria-label="AI对话输入框"
                        />
                        <button
                            onClick={onSend}
                            disabled={disabledSend}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: disabledSend ? '#f5f5f5' : '#1677ff',
                                color: disabledSend ? '#bfbfbf' : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: disabledSend ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 500
                            }}
                        >
                            <SendOutlined/>
                            发送
                        </button>
                    </Flex>
                </Flex>
            </Card>
        </XProvider>
    );
};

// export default AiChatPanel;