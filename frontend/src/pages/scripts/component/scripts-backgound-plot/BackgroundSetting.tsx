import React, { useEffect, useMemo, useState } from 'react';
import { Col, message, Row } from 'antd';
import { ScriptProject } from '@/api/types/project-types.ts';
import { AiChatPanel } from './AiChatPanel.tsx';
import { TextEditorPanel } from './TextEditorPanel.tsx';
import {
  AiMessage,
  AiThought,
  AiThoughtChain,
  createDefaultMessage,
} from '@/api/types/ai-chat-types.ts';
import { streamBrainstormingChat } from '@/api/service/brainstorming-chat.ts';
import { getConversationMessages, markConversationRead } from '@/api/service/conversations.ts';

interface BackgroundSettingProps {
  project: ScriptProject | null;
  onContentChange: (content: string) => void;
}

const BackgroundSetting: React.FC<BackgroundSettingProps> = ({ project, onContentChange }) => {
  const layoutScopeAttrValue = useMemo(() => `background-setting-${Math.random().toString(36).slice(2)}`, []);
  const [leftContent, setLeftContent] = useState<string>(project?.theme || '');
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiThoughts, setAiThoughts] = useState<AiThought[]>([]);
  const [aiThoughtChains, setAiThoughtChains] = useState<AiThoughtChain[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  // const [, setSaving] = useState<boolean>(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const assistantMessageIdRef = React.useRef<string | null>(null);
  const pendingDeltaRef = React.useRef<string>('');
  const flushHandleRef = React.useRef<number | null>(null);

  // 初始化session_id
  useEffect(() => {
    if (!project?.id) return () => {};
    setSessionId('');
    setAiMessages([]);
    setAiThoughts([]);
    setAiThoughtChains([]);
    setInputMessage('');
    setIsStreaming(false);
    return () => {};
  }, [project]);

  const generateConversationId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  // 当左侧内容变化时，通知父组件
  useEffect(() => {
    onContentChange(leftContent);
  }, [leftContent, onContentChange]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
      if (flushHandleRef.current !== null) {
        window.clearTimeout(flushHandleRef.current);
        flushHandleRef.current = null;
      }
    };
  }, []);

  /*@ts-ignore*/
  // const handleSave = async () => {
  //     if (!project?.id) return;
  //
  //     try {
  //         setSaving(true);
  //         // 更新项目主题字段
  //         await projectApi.updateProjectTheme(project.id, leftContent);
  //         message.success('背景设定保存成功！');
  //     } catch (error) {
  //         console.error('保存背景设定失败:', error);
  //         message.error('保存失败，请重试');
  //     } finally {
  //         setSaving(false);
  //     }
  // };

  const scheduleFlush = () => {
    if (flushHandleRef.current !== null) return;
    flushHandleRef.current = window.setTimeout(() => {
      flushHandleRef.current = null;
      const delta = pendingDeltaRef.current;
      if (!delta) return;
      pendingDeltaRef.current = '';
      const assistantId = assistantMessageIdRef.current;
      if (!assistantId) return;
      setAiMessages((prev) => {
        const idx = prev.findIndex((item) => item.id === assistantId);
        if (idx === -1) return prev;
        const next = [...prev];
        const current = next[idx];
        next[idx] = { ...current, text: `${current.text}${delta}`, status: 'received' };
        return next;
      });
    }, 16);
  };

  const handleCancel = () => {
    const controller = abortRef.current;
    if (!controller) return;
    controller.abort();
    abortRef.current = null;
    assistantMessageIdRef.current = null;
    pendingDeltaRef.current = '';
    if (flushHandleRef.current !== null) {
      window.clearTimeout(flushHandleRef.current);
      flushHandleRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleSendToAI = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;
    const conversationId = sessionId || generateConversationId();
    if (!sessionId) setSessionId(conversationId);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMessage = createDefaultMessage(trimmed, 'user');
    const assistantMessage = createDefaultMessage('', 'assistant');
    assistantMessageIdRef.current = assistantMessage.id;
    setAiMessages((prev) => [...prev, userMessage, assistantMessage]);
    setAiThoughts([]);
    setAiThoughtChains([]);
    setInputMessage('');
    setIsStreaming(true);
    pendingDeltaRef.current = '';
    if (flushHandleRef.current !== null) {
      window.clearTimeout(flushHandleRef.current);
      flushHandleRef.current = null;
    }

    try {
      await streamBrainstormingChat(
        {
          conversationId,
          message: trimmed,
          enableSearch: true,
          projectId: project?.id ?? undefined,
          conversationTitle: '背景设定讨论'
        },
        {
          signal: abortRef.current.signal,
          timeoutMs: 15000,
          maxRetries: 2,
          retryDelayMs: 300,
          onDelta: (delta) => {
            pendingDeltaRef.current += delta;
            scheduleFlush();
          },
        },
      );
      if (pendingDeltaRef.current) {
        scheduleFlush();
      }
    } catch (error) {
      const aborted =
        (error instanceof DOMException && error.name === 'AbortError') ||
        (error instanceof Error && error.name === 'AbortError') ||
        abortRef.current?.signal.aborted;
      if (!aborted) {
        const assistantId = assistantMessageIdRef.current;
        if (assistantId) {
          setAiMessages((prev) => {
            const idx = prev.findIndex((item) => item.id === assistantId);
            if (idx === -1) return prev;
            const next = [...prev];
            next[idx] = { ...next[idx], text: '请求失败，请稍后重试', status: 'error' };
            return next;
          });
        }
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      assistantMessageIdRef.current = null;
      pendingDeltaRef.current = '';
      if (flushHandleRef.current !== null) {
        window.clearTimeout(flushHandleRef.current);
        flushHandleRef.current = null;
      }
    }
  };

  const handleClearHistory = () => {
    setAiMessages([]);
    setAiThoughts([]);
    setAiThoughtChains([]);
  };

  const handleConversationSelect = async (conversationId: string) => {
    handleCancel();
    setSessionId(conversationId);
    setAiThoughts([]);
    setAiThoughtChains([]);
    setIsStreaming(false);
    setInputMessage('');
    try {
      const history = await getConversationMessages(conversationId);
      setAiMessages(
        history.map((m, idx) => ({
          id: `hist-${conversationId}-${idx}`,
          role: m.role === 'assistant' ? 'assistant' : 'user',
          text: m.content ?? '',
          timestamp: m.timestamp || Date.now(),
          status: m.role === 'assistant' ? 'received' : 'sent',
        })),
      );
      await markConversationRead(conversationId);
    } catch {
      message.error('加载会话失败');
    }
  };

  return (
    <div data-layout-scope={layoutScopeAttrValue} style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      overflow: 'hidden',
      width: '100%',
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
      <Row className="bg-row" gutter={[24, 24]}
           style={{ flex: 1, height: '100%', width: '100%', minHeight: 0, alignItems: 'stretch' }}>
        {/* 左侧文本编辑区 */}
        <Col xs={24} md={12}
             style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TextEditorPanel
            // title="背景设定"
            // subtitle="请在此处编写剧本的背景设定内容"
            value={leftContent}
            onChange={setLeftContent}
            placeholder="请输入剧本背景设定..."
            // showSaveButton={true}
            // onSave={handleSave}
          />
        </Col>

        {/* 右侧AI对话区 */}
        <Col xs={24} md={12} style={
          { height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
        }>
          <AiChatPanel
            title="AI创作助手"
            subtitle="与AI助手讨论背景设定与创作灵感"
            sessionId={sessionId}
            messages={aiMessages}
            thoughts={aiThoughts}
            thoughtChains={aiThoughtChains}
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

export default BackgroundSetting;
