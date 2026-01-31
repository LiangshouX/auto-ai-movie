import React, {useEffect, useState} from 'react';
// 添加 message 导入
import {Col, message, Row} from 'antd';
import {ScriptProject} from '../../../../api/types/project-types.ts';
import {projectApi} from '../../../../api/service/ai-scripts.ts';
import {AiChatPanel} from './AiChatPanel.tsx'
import {TextEditorPanel} from './TextEditorPanel.tsx'

interface BackgroundSettingProps {
    project: ScriptProject | null;
    onContentChange: (content: string) => void;
}

const BackgroundSetting: React.FC<BackgroundSettingProps> = ({project, onContentChange}) => {
    const [leftContent, setLeftContent] = useState<string>(project?.theme || '');
    const [sessionId, setSessionId] = useState<string>('');
    const [aiMessages, setAiMessages] = useState<{ id: string, text: string, role: 'user' | 'assistant' }[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);

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
                        title="AI助手"
                        subtitle="与AI助手讨论背景设定"
                        sessionId={sessionId}
                        messages={aiMessages}
                        inputMessage={inputMessage}
                        onInputChange={setInputMessage}
                        onSend={handleSendToAI}
                        disabledSend={!inputMessage.trim()}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default BackgroundSetting;