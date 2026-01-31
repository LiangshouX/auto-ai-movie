import { useState } from 'react';
import { Card, Typography, Space, Button, Divider } from 'antd';
import { 
    MessageOutlined, 
    ThunderboltOutlined, 
    LinkOutlined
} from '@ant-design/icons';
import { AiChatPanel } from './AiChatPanel';
import { 
    AiMessage, 
    AiThought, 
    AiThoughtChain, 
    ConversationSession,
    createDefaultMessage,
    createDefaultConversation
} from '../../../../api/types/ai-chat-types';

const { Title, Text } = Typography;

const AiChatDemo = () => {
    const [messages, setMessages] = useState<AiMessage[]>([]);
    const [thoughts, setThoughts] = useState<AiThought[]>([]);
    const [thoughtChains, setThoughtChains] = useState<AiThoughtChain[]>([]);
    const [conversations] = useState<ConversationSession[]>([
        createDefaultConversation('demo-project-1', '背景设定讨论'),
        createDefaultConversation('demo-project-2', '角色设计咨询'),
        createDefaultConversation('demo-project-3', '剧情发展建议')
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [activeDemo, setActiveDemo] = useState<'basic' | 'advanced' | 'streaming'>('basic');

    const demos = {
        basic: {
            title: "基础对话演示",
            description: "展示基本的用户-AI对话功能"
        },
        advanced: {
            title: "高级功能演示", 
            description: "展示思考过程和执行链功能"
        },
        streaming: {
            title: "流式输出演示",
            description: "模拟AI流式响应效果"
        }
    };

    const handleSendBasic = () => {
        if (!inputMessage.trim()) return;
        
        const userMsg = createDefaultMessage(inputMessage, 'user');
        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        
        setTimeout(() => {
            const aiMsg = createDefaultMessage(
                `收到您的消息："${inputMessage}"。这是基础的AI回复示例。`,
                'assistant'
            );
            setMessages(prev => [...prev, aiMsg]);
        }, 800);
    };

    const handleSendAdvanced = () => {
        if (!inputMessage.trim()) return;
        
        const userMsg = createDefaultMessage(inputMessage, 'user');
        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsStreaming(true);
        
        // 模拟思考过程
        setTimeout(() => {
            setThoughts([
                {
                    id: 'think-1',
                    content: '分析用户创作需求...',
                    type: 'analyzing',
                    timestamp: Date.now()
                },
                {
                    id: 'think-2', 
                    content: '构思个性化建议...',
                    type: 'planning',
                    timestamp: Date.now() + 300
                }
            ]);
        }, 200);
        
        // 模拟执行链
        setTimeout(() => {
            setThoughtChains([{
                id: 'chain-1',
                thoughts: [
                    {
                        id: 'sub-1',
                        content: '识别创作类型和风格偏好',
                        type: 'analyzing',
                        timestamp: Date.now()
                    },
                    {
                        id: 'sub-2',
                        content: '匹配相关创作技巧和建议',
                        type: 'planning', 
                        timestamp: Date.now() + 200
                    }
                ],
                finalAnswer: '基于您的输入，建议重点关注角色动机和情节逻辑的一致性',
                timestamp: Date.now() + 500
            }]);
        }, 600);
        
        // 最终回复
        setTimeout(() => {
            const aiMsg = createDefaultMessage(
                `关于"${inputMessage}"，经过深度分析，我建议：\n\n` +
                `🌟 **核心要点**
• 强化故事内在逻辑
• 深化角色性格刻画
• 优化情节推进节奏

` +
                `🎯 **具体建议**\n1. 明确主角的核心动机\n2. 设计合理的冲突转折\n3. 保持叙事风格一致性`,
                'assistant'
            );
            setMessages(prev => [...prev, aiMsg]);
            setIsStreaming(false);
            setThoughts([]);
            setThoughtChains([]);
        }, 1200);
    };

    const handleSendStreaming = () => {
        if (!inputMessage.trim()) return;
        
        const userMsg = createDefaultMessage(inputMessage, 'user');
        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsStreaming(true);
        
        // 模拟逐字输出效果
        const responseText = `关于"${inputMessage}"，让我逐步为您分析：\n\n` +
            `第一步：理解核心概念...\n` +
            `第二步：分析潜在发展方向...\n` +
            `第三步：提供具体实施建议...\n\n` +
            `综合建议：建议采用多层次叙事结构，增强故事的深度和广度。`;
            
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= responseText.length) {
                const partialText = responseText.slice(0, currentIndex);
                const tempMsg: AiMessage = {
                    id: 'temp-streaming',
                    text: partialText,
                    role: 'assistant',
                    timestamp: Date.now(),
                    status: 'sending'
                };
                
                setMessages(prev => {
                    const filtered = prev.filter(msg => msg.id !== 'temp-streaming');
                    return [...filtered, tempMsg];
                });
                
                currentIndex += 2; // 每次增加2个字符模拟打字效果
            } else {
                clearInterval(interval);
                const finalMsg = createDefaultMessage(responseText, 'assistant');
                setMessages(prev => {
                    const filtered = prev.filter(msg => msg.id !== 'temp-streaming');
                    return [...filtered, finalMsg];
                });
                setIsStreaming(false);
            }
        }, 50);
    };

    const handleClearHistory = () => {
        setMessages([]);
        setThoughts([]);
        setThoughtChains([]);
    };

    const handleConversationSelect = (conversationId: string) => {
        console.log('切换到会话:', conversationId);
    };

    const getCurrentHandler = () => {
        switch (activeDemo) {
            case 'basic': return handleSendBasic;
            case 'advanced': return handleSendAdvanced;
            case 'streaming': return handleSendStreaming;
            default: return handleSendBasic;
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Card>
                <Title level={2}>AI聊天面板功能演示</Title>
                <Text type="secondary">基于Ant Design X的专业AI对话组件</Text>
                
                <Divider />
                
                {/* 演示模式选择 */}
                <Space wrap style={{ marginBottom: 24 }}>
                    <Button 
                        type={activeDemo === 'basic' ? 'primary' : 'default'}
                        icon={<MessageOutlined />}
                        onClick={() => setActiveDemo('basic')}
                    >
                        基础对话
                    </Button>
                    <Button 
                        type={activeDemo === 'advanced' ? 'primary' : 'default'}
                        icon={<ThunderboltOutlined />}
                        onClick={() => setActiveDemo('advanced')}
                    >
                        高级功能
                    </Button>
                    <Button 
                        type={activeDemo === 'streaming' ? 'primary' : 'default'}
                        icon={<LinkOutlined />}
                        onClick={() => setActiveDemo('streaming')}
                    >
                        流式输出
                    </Button>
                </Space>
                
                <Card 
                    size="small" 
                    style={{ marginBottom: 24, backgroundColor: '#f0f5ff' }}
                >
                    <Text strong>{demos[activeDemo].title}</Text>
                    <br />
                    <Text type="secondary">{demos[activeDemo].description}</Text>
                </Card>

                {/* AI聊天面板 */}
                <div style={{ height: 600 }}>
                    <AiChatPanel
                        title="AI创作助手演示"
                        subtitle={`当前模式: ${demos[activeDemo].title}`}
                        sessionId="demo-session-123"
                        messages={messages}
                        thoughts={thoughts}
                        thoughtChains={thoughtChains}
                        conversations={conversations}
                        inputMessage={inputMessage}
                        onInputChange={setInputMessage}
                        onSend={getCurrentHandler()}
                        onClearHistory={handleClearHistory}
                        onConversationSelect={handleConversationSelect}
                        disabledSend={!inputMessage.trim()}
                        isStreaming={isStreaming}
                    />
                </div>
            </Card>
        </div>
    );
};

export default AiChatDemo;