import React, { useState } from 'react';
import { Card, Typography, Button, Flex } from 'antd';
import { AiChatPanel } from './AiChatPanel';
import { AiMessage, createDefaultMessage } from '@/api/types/ai-chat-types';

const { Title } = Typography;

const AutoScrollTest = () => {
    const [messages, setMessages] = useState<AiMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    
    // 使用useEffect来处理副作用
    React.useEffect(() => {
        // 这里可以添加初始化逻辑
    }, []);

    const handleAddMessage = () => {
        if (!inputMessage.trim()) return;
        
        const userMsg = createDefaultMessage(inputMessage, 'user');
        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        
        // 添加AI回复
        setTimeout(() => {
            const aiMsg = createDefaultMessage(
                `收到您的消息: "${inputMessage}"。这是自动滚动测试的AI回复。`,
                'assistant'
            );
            setMessages(prev => [...prev, aiMsg]);
        }, 500);
    };

    const handleClear = () => {
        setMessages([]);
    };

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Card>
                <Title level={2}>自动滚动功能测试</Title>
                
                <Flex gap={16} style={{ marginBottom: 24 }}>
                    <Button onClick={handleClear}>清空消息</Button>
                    <Button type="primary" onClick={handleAddMessage}>添加测试消息</Button>
                </Flex>

                <div style={{ height: 500 }}>
                    <AiChatPanel
                        title="自动滚动测试"
                        subtitle="发送消息后会自动滚动到底部"
                        messages={messages}
                        inputMessage={inputMessage}
                        onInputChange={setInputMessage}
                        onSend={handleAddMessage}
                        disabledSend={!inputMessage.trim()}
                    />
                </div>
            </Card>
        </div>
    );
};

export default AutoScrollTest;