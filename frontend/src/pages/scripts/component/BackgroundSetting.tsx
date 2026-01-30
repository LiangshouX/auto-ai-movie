import React, {useState, useEffect} from 'react';
import {Card, Row, Col, Typography, Input, Button, List, Avatar, Space, Divider, Flex} from 'antd';
import {SendOutlined, RobotOutlined, UserOutlined} from '@ant-design/icons';
import {ScriptProject} from '../../../api/types/project-types';

const {Title, Text} = Typography;
const {TextArea} = Input;

interface BackgroundSettingProps {
    project: ScriptProject | null;
    onContentChange: (content: string) => void;
}

const BackgroundSetting: React.FC<BackgroundSettingProps> = ({project, onContentChange}) => {
    const [leftContent, setLeftContent] = useState<string>(project?.theme || '');
    const [sessionId, setSessionId] = useState<string>('');
    const [aiMessages, setAiMessages] = useState<{ id: string, text: string, role: 'user' | 'assistant' }[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

    // 初始化session_id，使用projectId + 时间戳
    useEffect(() => {
        if (project?.id) {
            const sessionId = `${project.id}-${Date.now()}`;
            setSessionId(sessionId);
        }
    }, [project]);

    // 当左侧内容变化时，通知父组件
    useEffect(() => {
        onContentChange(leftContent);
    }, [leftContent]);

    const handleLeftContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setLeftContent(newValue);
    };

    const handleSendToAI = () => {
        if (!inputMessage.trim()) return;

        // 添加用户消息到对话历史
        const userMessage = {
            id: `msg-${Date.now()}`,
            text: inputMessage,
            role: 'user' as const
        };

        setAiMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        // 模拟AI响应（实际需要调用后端API)
        setTimeout(() => {
            const aiResponse = {
                id: `msg-${Date.now() + 1}`,
                text: `感谢您的输入！关于 "${inputMessage}"，我理解这是一个重要的背景设定。根据您提供的信息，我建议可以进一步扩展这个设定，使其更加丰富和有深度。`,
                role: 'assistant' as const
            };
            setAiMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendToAI();
        }
    };

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Row gutter={[24, 24]} style={{flex: 1, width: '100%'}}>
                {/* 左侧文本编辑区 */}
                <Col xs={24} md={12} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <Card
                        title={
                            <div>
                                <Title level={4} style={{margin: 0}}>背景设定</Title>
                                <Text type="secondary">请在此处编写剧本的背景设定内容</Text>
                            </div>
                        }
                        style={{flex: 1, display: 'flex', flexDirection: 'column'}}
                        styles={{body: {flex: 1, padding: 0, display: 'flex'}}}
                    >
                        <TextArea
                            value={leftContent}
                            onChange={handleLeftContentChange}
                            placeholder="请输入剧本背景设定..."
                            rows={15}
                            style={{
                                flex: 1,
                                border: 'none',
                                borderRadius: 0,
                                padding: '12px',
                                minHeight: 400,
                                minWidth: 300,
                            }}
                            aria-label="背景设定编辑区域"
                        />
                    </Card>
                </Col>

                {/* 右侧AI对话区 */}
                <Col xs={24} md={12} style={{height: '100%'}}>
                    <Card
                        title={
                            <Flex justify="space-between" align="center">
                                <div>
                                    <Title level={4} style={{margin: 0}}>AI助手</Title>
                                    <Text type="secondary">与AI助手讨论背景设定</Text>
                                </div>
                                {sessionId && (
                                    <Text type="secondary" code>会话ID: {sessionId}</Text>
                                )}
                            </Flex>
                        }
                        style={{height: '100%', display: 'flex', flexDirection: 'column'}}
                    >
                        <Flex vertical style={{
                            height: '100%',
                            justifyContent: 'space-between',
                            paddingTop: 16
                        }}>
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                marginBottom: 16,
                                maxHeight: 'calc(100vh - 200px)'
                            }}>
                                {aiMessages.length === 0 ? (
                                    <Flex vertical align="center" justify="center"
                                          style={{height: '100%', textAlign: 'center', color: '#bfbfbf'}}>
                                        <RobotOutlined style={{fontSize: 48, marginBottom: 16}}/>
                                        <Title level={5}>欢迎使用AI助手！</Title>
                                        <Text type="secondary">您可以输入问题或想法，AI将为您提供创作建议。</Text>
                                    </Flex>
                                ) : (
                                    <List
                                        dataSource={aiMessages}
                                        renderItem={(message) => (
                                            <List.Item style={{
                                                padding: '8px 0',
                                                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                                            }}>
                                                <List.Item.Meta
                                                    avatar={
                                                        message.role === 'assistant' ? (
                                                            <Avatar icon={<RobotOutlined/>}
                                                                    style={{backgroundColor: '#1890ff'}}/>
                                                        ) : (
                                                            <Avatar icon={<UserOutlined/>}
                                                                    style={{backgroundColor: '#52c41a'}}/>
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

                            <Divider style={{margin: '8px 0'}}/>

                            <Space.Compact style={{width: '100%'}}>
                                <TextArea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="输入您的问题或想法..."
                                    rows={2}
                                    style={{flexGrow: 1}}
                                    aria-label="AI对话输入框"
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined/>}
                                    onClick={handleSendToAI}
                                    disabled={!inputMessage.trim()}
                                    style={{height: 'auto', padding: '8px 12px'}}
                                >
                                    发送
                                </Button>
                            </Space.Compact>
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BackgroundSetting;