import React from 'react';
import { Card, Typography, Input, Button, List, Avatar, Space, Divider, Flex } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface AiMessage {
  id: string;
  text: string;
  role: 'user' | 'assistant';
}

interface AiChatPanelProps {
  title: string;
  subtitle: string;
  sessionId?: string;
  messages: AiMessage[];
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  disabledSend?: boolean;
}

export const AiChatPanel: React.FC<AiChatPanelProps> = ({
  title,
  subtitle,
  sessionId,
  messages,
  inputMessage,
  onInputChange,
  onSend,
  disabledSend = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Card 
      title={
      <div>
        <Flex justify="space-between" align="center">
          <div>
            <Title level={4} style={{ margin: 0 }}>{title}</Title>
          </div>
          {sessionId && (
              <Text type="secondary" code color={'#10b981'}>
                会话ID: {sessionId}
              </Text>
          )}
        </Flex>
        <Text type="secondary">{subtitle}</Text>
      </div>

      }
      style={{ height: '100%' }}
    >
      <Flex vertical style={{ 
        height: 'calc(100% - 80px)', 
        justifyContent: 'space-between'
      }}>
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          marginBottom: 16,
          minHeight: 'calc(100vh - 300px)',
          maxHeight: 'calc(100vh - 300px)'
        }}>
          {messages.length === 0 ? (
            <Flex vertical align="center" justify="center" style={{ height: '100%', textAlign: 'center', color: '#bfbfbf' }}>
              <RobotOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <Title level={5}>欢迎使用AI助手！</Title>
              <Text type="secondary">您可以输入问题或想法，AI将为您提供创作建议。</Text>
            </Flex>
          ) : (
            <List
              dataSource={messages}
              renderItem={(message) => (
                <List.Item style={{
                  padding: '8px 0',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <List.Item.Meta
                    avatar={
                      message.role === 'assistant' ? (
                        <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                      ) : (
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                      )
                    }
                    title={
                      <Text strong>
                        {message.role === 'assistant' ? 'AI助手' : '您'}
                      </Text>
                    }
                    description={
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: 6,
                        backgroundColor: message.role === 'assistant' ? '#f0f5ff' : '#f6ffed',
                        border: message.role === 'assistant' ? '1px solid #d6e4ff' : '1px solid #b7eb8f',
                        maxWidth: '90%'
                      }}>
                        {message.text}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
        
        <Divider style={{ margin: '8px 0' }} />
        
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题或想法..."
            rows={2}
            style={{ flexGrow: 1 }}
            aria-label="AI对话输入框"
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={onSend}
            disabled={disabledSend}
            style={{ height: 'auto', padding: '8px 12px' }}
          >
            发送
          </Button>
        </Space.Compact>
      </Flex>
    </Card>
  );
};

// export default AiChatPanel;