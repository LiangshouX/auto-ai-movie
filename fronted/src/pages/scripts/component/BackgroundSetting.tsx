import React, { useState, useEffect } from 'react';
import { ScriptProject } from '../../../api/types/project-types';

interface BackgroundSettingProps {
  project: ScriptProject | null;
  onContentChange: (content: string) => void;
}

const BackgroundSetting: React.FC<BackgroundSettingProps> = ({ project, onContentChange }) => {
  const [leftContent, setLeftContent] = useState<string>(project?.theme || '');
  const [sessionId, setSessionId] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<{id: string, text: string, role: 'user' | 'assistant'}[]>([]);
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
    <div className="background-setting-container">
      <div className="two-column-layout">
        {/* 左侧文本编辑区 */}
        <div className="left-column">
          <div className="editor-header">
            <h3>背景设定</h3>
            <p>请在此处编写剧本的背景设定内容</p>
          </div>
          <div className="editor-content">
            <textarea
              value={leftContent}
              onChange={handleLeftContentChange}
              placeholder="请输入剧本背景设定..."
              className="text-editor"
              rows={20}
              aria-label="背景设定编辑区域"
            />
          </div>
        </div>

        {/* 右侧AI对话区 */}
        <div className="right-column">
          <div className="ai-chat-header">
            <h3>AI助手</h3>
            <p>与AI助手讨论背景设定</p>
            {sessionId && <span className="session-id">会话ID: {sessionId}</span>}
          </div>
          <div className="ai-chat-container">
            <div className="chat-messages">
              {aiMessages.length === 0 ? (
                <div className="empty-chat">
                  <p>欢迎使用AI助手！</p>
                  <p>您可以输入问题或想法，AI将为您提供创作建议。</p>
                </div>
              ) : (
                aiMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`chat-message ${message.role}`}
                  >
                    <div className="message-content">
                      {message.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="chat-input">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题或想法..."
                rows={3}
                aria-label="AI对话输入框"
              />
              <button 
                className="send-btn"
                onClick={handleSendToAI}
                disabled={!inputMessage.trim()}
                aria-label="发送消息"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSetting;