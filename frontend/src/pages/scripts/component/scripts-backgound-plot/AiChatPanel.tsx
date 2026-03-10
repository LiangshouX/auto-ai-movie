import React from 'react';
import {Card, Flex, message, Tag, Typography} from 'antd';
import {XProvider, Bubble, Welcome, Actions, Conversations, Think, ThoughtChain, Sender} from '@ant-design/x';
import {SendOutlined, HistoryOutlined, ClearOutlined} from '@ant-design/icons';
import {ClassNames, useTheme} from '@emotion/react';
import {AiMessage, AiThought, AiThoughtChain, ConversationSession} from '@/api/types/ai-chat-types.ts';
import type {AppTheme} from '@/theme';
import {clearBrainstormingConversation} from '@/api/service/brainstorming-chat.ts';
import {useChatHistory} from './hooks/useChatHistory';
import {BotAvatar, UserAvatar} from './components/ChatAvatars';

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
    onSend: (message: string) => void;
    onCancel?: () => void;
    onClearHistory?: () => void;
    onConversationSelect?: (conversationId: string) => void;
    disabledSend?: boolean;
    isStreaming?: boolean;
    currentUserName?: string;
    userAvatarUrl?: string;
}

export const AiChatPanel: React.FC<AiChatPanelProps> = (
    {
        title,
        sessionId,
        messages,
        thoughts = [],
        thoughtChains = [],
        inputMessage,
        onInputChange,
        onSend,
        onConversationSelect,
        disabledSend = false,
        isStreaming = false,
        currentUserName,
        userAvatarUrl,
        onCancel,
        onClearHistory,
    }
) => {
    const theme = useTheme() as AppTheme;
    const senderRef = React.useRef<any>(null);
    const [expandedMap, setExpandedMap] = React.useState<Record<string, boolean>>({});
    const maxInlineChars = 5000;

    const {
        historyOpen,
        setHistoryOpen,
        historyLoading,
        historyError,
        visibleConversations,
        activeConversationId,
        handleCreateConversation,
        handleRenameConversation,
        handleDeleteConversation,
        handleSelectConversation
    } = useChatHistory(sessionId, onConversationSelect);

    React.useEffect(() => {
        const focusId = window.setTimeout(() => {
            const ref = senderRef.current;
            if (!ref) return;
            if (typeof ref.focus === 'function') {
                ref.focus();
                return;
            }
            const inputEl = ref.inputElement;
            if (inputEl && typeof inputEl.focus === 'function') {
                inputEl.focus();
            }
        }, 0);
        return () => window.clearTimeout(focusId);
    }, []);

    // 配置Ant Design X主题
    const xTheme = {
        token: {
            colorPrimary: theme.color.primary,
            colorBgContainer: theme.color.backgroundLight,
            colorText: theme.color.textPrimary,
            fontSize: theme.typography.headerSubtitleSize,
            borderRadius: theme.radius.md,
        },
        components: {
            Bubble: {
                colorUser: theme.color.primary,
                colorAssistant: '#f0f0f0',
                borderRadius: theme.radius.lg,
            },
            Welcome: {
                colorBg: theme.color.glassLightBackground,
                colorText: theme.color.textSecondary,
            },
        },
    };

    const messagesContainerRef = React.useRef<HTMLDivElement>(null);

    // 自动滚动到底部
    React.useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, thoughts, thoughtChains]);

    const formatTime = (iso: string | null) => {
        if (!iso) return '暂无消息';
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return '暂无消息';
        return date.toLocaleString();
    };

    const toggleExpanded = React.useCallback((messageId: string) => {
        setExpandedMap((prev) => ({...prev, [messageId]: !prev[messageId]}));
    }, []);

    const renderMessageContent = React.useCallback(
        (text: string, messageId: string) => {
            const normalized = text ?? '';
            const isLong = normalized.length > maxInlineChars;
            const expanded = expandedMap[messageId] ?? false;
            const display = isLong && !expanded ? `${normalized.slice(0, maxInlineChars)}…` : normalized;
            return (
                <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere'}}>
                    {display}
                    {isLong && (
                        <div style={{marginTop: 8}}>
                            <Typography.Link onClick={() => toggleExpanded(messageId)}>
                                {expanded ? '收起' : '展开'}
                            </Typography.Link>
                            {!expanded && (
                                <Text type="secondary" style={{marginLeft: 8}}>
                                    {maxInlineChars}/{normalized.length} 字符
                                </Text>
                            )}
                        </div>
                    )}
                </div>
            );
        },
        [expandedMap, toggleExpanded],
    );

    const bubbleItems = React.useMemo(() => {
        type XMessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
        const toStatus = (s?: AiMessage['status']): XMessageStatus | undefined => {
            if (!s) return undefined;
            if (s === 'sending') return 'loading';
            if (s === 'error') return 'error';
            return 'success';
        };
        return messages.map((m) => ({
            key: m.id,
            role: m.role === 'assistant' ? 'ai' : 'user',
            content: m.text,
            status: toStatus(m.status),
        }));
    }, [messages]);

    const handleClearHistoryClick = async () => {
        if (!sessionId) {
            onClearHistory?.();
            message.success('对话历史已清空');
            return;
        }

        try {
            await clearBrainstormingConversation(sessionId);
            onClearHistory?.();
            message.success('对话历史已清空');
        } catch {
            message.error('清空失败，请稍后重试');
        }
    };

    return (
        <XProvider theme={xTheme}>
            <Card
                title={
                    <ClassNames>
                        {({css}) => (
                            <div
                                className={css({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: theme.spacing.sm,
                                })}
                            >
                                <Flex justify="space-between" align="center">
                                    <div>
                                        <Title
                                            level={4}
                                            style={{margin: 0}}
                                        >
                                            {title}
                                        </Title>
                                    </div>
                                    {sessionId && (
                                        <Text type="secondary">
                                            会话ID:{' '}
                                            <Tag color={theme.color.success}>
                                                {sessionId.substring(0, 32)}
                                            </Tag>
                                        </Text>
                                    )}
                                </Flex>
                            </div>
                        )}
                    </ClassNames>
                }
                style={{height: '100%', position: 'relative', display: 'flex', flexDirection: 'column'}}
                styles={{
                    body: {
                        flex: 1,
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    },
                }}
                extra={
                    <Actions
                        items={[
                            {
                                key: 'history',
                                icon: <HistoryOutlined/>,
                                label: '对话历史',
                                onItemClick: () => setHistoryOpen((v) => !v),
                            },
                            {
                                key: 'clear',
                                icon: <ClearOutlined/>,
                                label: '清空历史',
                                onItemClick: handleClearHistoryClick,
                                danger: true,
                            },
                        ]}
                    />
                }
            >
                <Flex style={{flex: 1, minHeight: 0, gap: 16, overflow: 'hidden'}}>
                    {historyOpen && (
                        <div style={{width: 320, minWidth: 260, height: '100%', overflow: 'auto'}}>
                            <Flex justify="space-between" align="center" style={{marginBottom: 12}}>
                                <Text strong>历史对话</Text>
                                <Typography.Link onClick={handleCreateConversation}>新建</Typography.Link>
                            </Flex>
                            {historyError ? (
                                <Welcome title="加载失败" description={historyError} icon={<BotAvatar />} />
                            ) : visibleConversations.length === 0 ? (
                                <Welcome title="暂无历史对话" description="点击右上角“新建”开始新的会话。" icon={<BotAvatar />} />
                            ) : (
                                <Conversations
                                    activeKey={activeConversationId}
                                    items={visibleConversations.map((c) => ({
                                        key: c.id,
                                        label: (
                                            <Flex justify="space-between" align="center" style={{width: '100%'}}>
                                                <div style={{minWidth: 0}}>
                                                    <Text ellipsis style={{display: 'block'}}>
                                                        {c.title}
                                                    </Text>
                                                    <Text type="secondary" style={{fontSize: 12}}>
                                                        {formatTime(c.lastMessageAt)}
                                                    </Text>
                                                </div>
                                                {c.unreadCount > 0 && (
                                                    <Tag color="red" style={{marginInlineStart: 8}}>
                                                        {c.unreadCount}
                                                    </Tag>
                                                )}
                                            </Flex>
                                        ),
                                    }))}
                                    menu={(conversation) => ({
                                        items: [
                                            {key: 'rename', label: '重命名'},
                                            {key: 'delete', label: '删除', danger: true},
                                        ],
                                        onClick: ({key}) => {
                                            const id = conversation.key;
                                            const found = visibleConversations.find((x) => x.id === id);
                                            const currentTitle = found?.title ?? '未命名对话';
                                            if (key === 'rename') {
                                                void handleRenameConversation(id, currentTitle);
                                            }
                                            if (key === 'delete') {
                                                void handleDeleteConversation(id);
                                            }
                                        },
                                    })}
                                    onActiveChange={handleSelectConversation}
                                    styles={{
                                        creation: {display: 'none'},
                                    }}
                                />
                            )}
                            {historyLoading && (
                                <Text type="secondary" style={{display: 'block', marginTop: 8}}>
                                    加载中…
                                </Text>
                            )}
                        </div>
                    )}
                    <Flex vertical style={{flex: 1, minWidth: 0, minHeight: 0, justifyContent: 'space-between'}}>
                        <div
                            ref={messagesContainerRef}
                            style={{flex: 1, overflowY: 'auto', marginBottom: 16, minHeight: 0}}
                        >
                            {messages.length === 0 ? (
                                <ClassNames>
                                    {({css}) => (
                                        <Welcome
                                            title="欢迎使用 AI 剧情顾问"
                                            description="通过智能洞察、秒级响应与持续学习，为你的剧本结构与情节打磨提供决策参考。"
                                            icon={<BotAvatar />}
                                            classNames={{
                                                root: css({
                                                    borderRadius: theme.radius.md,
                                                    padding: theme.spacing.lg,
                                                    backgroundColor: theme.color.glassLightBackground,
                                                    boxShadow: `inset 0 0 0 2px rgba(255, 255, 255, 0.65), 0 4px 24px ${theme.color.glassLightShadowOuter}`,
                                                    backdropFilter: 'blur(16px)',
                                                    transition: `transform ${theme.motion.welcomeTransitionDuration}ms ${theme.motion.easingEaseOutCubic}, box-shadow ${theme.motion.welcomeTransitionDuration}ms ${theme.motion.easingEaseOutCubic}`,
                                                    transformOrigin: 'center',
                                                    '&:hover': {
                                                        transform: `scale(${theme.motion.welcomeHoverScale})`,
                                                        boxShadow: `inset 0 0 0 2px rgba(255, 255, 255, 0.7), 0 8px 32px ${theme.color.glassLightShadowOuter}`,
                                                    },
                                                    '@media (prefers-color-scheme: dark)': {
                                                        backgroundColor: theme.color.glassDarkBackground,
                                                        boxShadow: `inset 0 0 0 2px rgba(31,31,31,0.8), 0 4px 24px ${theme.color.glassDarkShadowOuter}`,
                                                    },
                                                }),
                                                title: css({
                                                    fontSize: theme.typography.welcomeTitleSize,
                                                    fontWeight: theme.typography.headerWeightBold,
                                                    marginBottom: theme.spacing.md,
                                                }),
                                                description: css({
                                                    fontSize: theme.typography.welcomeDescriptionSize,
                                                    color: theme.color.textSecondary,
                                                    marginBottom: theme.spacing.md,
                                                    '@media (prefers-color-scheme: dark)': {
                                                        color: theme.color.textSecondaryDark,
                                                    },
                                                }),
                                                extra: css({
                                                    marginTop: theme.spacing.md,
                                                }),
                                            }}
                                            extra={(
                                                <button
                                                    type="button"
                                                    className={css({
                                                        height: theme.aiChat.welcome.buttonHeight,
                                                        borderRadius: theme.radius.lg,
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: theme.spacing.xs,
                                                        color: '#ffffff',
                                                        fontWeight: theme.typography.headerWeightBold,
                                                        fontSize: theme.typography.headerSubtitleSize,
                                                        backgroundImage: `linear-gradient(135deg, ${theme.aiChat.welcome.primaryGradientFrom}, ${theme.aiChat.welcome.primaryGradientTo})`,
                                                        boxShadow: '0 10px 25px rgba(89, 126, 247, 0.35)',
                                                        transition: `transform 0.3s ${theme.motion.easingEaseOutCubic}, box-shadow 0.3s ${theme.motion.easingEaseOutCubic}`,
                                                        transform: 'translateY(0)',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 16px 32px rgba(89, 126, 247, 0.45)',
                                                        },
                                                    })}
                                                >
                                                    立即开始对话
                                                </button>
                                            )}
                                        />
                                    )}
                                </ClassNames>
                            ) : (
                                <Flex vertical gap={16} style={{minHeight: 0}}>
                                    <div style={{display: 'flex', flexDirection: 'column', minHeight: 0}}>
                                        <Bubble.List
                                            autoScroll
                                            items={bubbleItems}
                                            role={{
                                                ai: {
                                                    placement: 'start',
                                                    avatar: <BotAvatar />,
                                                    variant: 'outlined',
                                                    contentRender: (content, info) =>
                                                        renderMessageContent(String(content ?? ''), String(info.key ?? '')),
                                                },
                                                user: {
                                                    placement: 'end',
                                                    avatar: <UserAvatar currentUserName={currentUserName} userAvatarUrl={userAvatarUrl} />,
                                                    variant: 'filled',
                                                    contentRender: (content, info) =>
                                                        renderMessageContent(String(content ?? ''), String(info.key ?? '')),
                                                },
                                            }}
                                        />
                                    </div>

                                    {thoughts.map((thought) => (
                                        <Think key={thought.id} content={thought.content} />
                                    ))}

                                    {thoughtChains.map((chain) => (
                                        <ThoughtChain key={chain.id} content={chain.finalAnswer} />
                                    ))}
                                </Flex>
                            )}
                        </div>

                        <Flex gap={8} style={{width: '100%'}}>
                            <Sender
                                ref={senderRef}
                                value={inputMessage}
                                onChange={(value) => onInputChange(value)}
                                onSubmit={(msg) => {
                                    if (isStreaming) return;
                                    onSend(msg);
                                }}
                                onCancel={onCancel}
                                placeholder="输入您的问题或想法..."
                                disabled={false}
                                loading={isStreaming}
                                autoSize={{minRows: 2, maxRows: 6}}
                                style={{width: '100%', maxWidth: '100%'}}
                                suffix={(_ori, {components}) => (
                                    <Flex gap={8} align="center">
                                        {isStreaming ? (
                                            <components.LoadingButton />
                                        ) : (
                                            <components.SendButton icon={<SendOutlined />} disabled={disabledSend} />
                                        )}
                                    </Flex>
                                )}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Card>
        </XProvider>
    );
};
