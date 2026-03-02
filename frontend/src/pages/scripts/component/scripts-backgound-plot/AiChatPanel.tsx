import React from 'react';
import {Card, Flex, Input, message, Modal, Tag, Typography} from 'antd';
import {XProvider, Bubble, Welcome, Actions, Conversations, Think, ThoughtChain, Sender} from '@ant-design/x';
import {SendOutlined, HistoryOutlined, ClearOutlined} from '@ant-design/icons';
import {ClassNames, keyframes, useTheme} from '@emotion/react';
import {AiMessage, AiThought, AiThoughtChain, ConversationSession} from '@/api/types/ai-chat-types.ts';
import type {AppTheme} from '@/theme';
import {clearBrainstormingConversation} from '@/api/service/brainstorming-chat.ts';
import {
    deleteConversation,
    listConversations,
    markConversationRead,
    renameConversation,
} from '@/api/service/conversations.ts';
import type {ConversationSummary} from '@/api/types/conversation-types.ts';

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
        // onClearHistory, // 暂时注释未使用的参数
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
    const [historyOpen, setHistoryOpen] = React.useState(false);
    const [historyLoading, setHistoryLoading] = React.useState(false);
    const [historyError, setHistoryError] = React.useState<string | null>(null);
    const [historyItems, setHistoryItems] = React.useState<ConversationSummary[]>([]);
    const [draftItems, setDraftItems] = React.useState<ConversationSummary[]>([]);
    const [activeConversationId, setActiveConversationId] = React.useState<string | undefined>(sessionId);

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
    const botAvatarPulse = keyframes`
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(89, 126, 247, 0.4);
        }
        50% {
            transform: scale(${theme.motion.avatarPulseScale});
            box-shadow: 0 0 0 8px rgba(89, 126, 247, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(89, 126, 247, 0);
        }
    `;

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

    React.useEffect(() => {
        setActiveConversationId(sessionId);
    }, [sessionId]);

    const refreshHistory = React.useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const resp = await listConversations({page: 1, size: 50});
            setHistoryItems(resp.items ?? []);
            setDraftItems((prev) => {
                const ids = new Set((resp.items ?? []).map((i) => i.id));
                return prev.filter((d) => !ids.has(d.id));
            });
        } catch (e) {
            const msg = e instanceof Error ? e.message : '加载失败';
            setHistoryError(msg);
            message.error('历史对话加载失败');
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void refreshHistory();
    }, [refreshHistory]);

    const formatTime = (iso: string | null) => {
        if (!iso) return '暂无消息';
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return '暂无消息';
        return date.toLocaleString();
    };

    const generateConversationId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const visibleConversations = React.useMemo(() => {
        const ids = new Set(historyItems.map((i) => i.id));
        return [...draftItems.filter((d) => !ids.has(d.id)), ...historyItems];
    }, [draftItems, historyItems]);

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

    const handleCreateConversation = async () => {
        const id = generateConversationId();
        setDraftItems((prev) => [
            {id, title: '新对话', lastMessageAt: null, unreadCount: 0},
            ...prev,
        ]);
        setHistoryOpen(true);
        setActiveConversationId(id);
        onConversationSelect?.(id);
    };

    const handleRenameConversation = async (id: string, currentTitle: string) => {
        let nextTitle = currentTitle;
        Modal.confirm({
            title: '重命名会话',
            content: (
                <Input
                    defaultValue={currentTitle}
                    maxLength={60}
                    onChange={(e) => {
                        nextTitle = e.target.value;
                    }}
                />
            ),
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const trimmed = nextTitle.trim();
                if (!trimmed) {
                    message.error('标题不能为空');
                    throw new Error('empty');
                }
                const exists = historyItems.some((item) => item.id === id);
                if (exists) {
                    await renameConversation(id, trimmed);
                    await refreshHistory();
                } else {
                    setDraftItems((prev) => prev.map((d) => (d.id === id ? {...d, title: trimmed} : d)));
                }
            },
        });
    };

    const handleDeleteConversation = async (id: string) => {
        Modal.confirm({
            title: '删除会话',
            content: '删除后将无法恢复，确认继续？',
            okText: '删除',
            cancelText: '取消',
            okButtonProps: {danger: true},
            onOk: async () => {
                const exists = historyItems.some((item) => item.id === id);
                if (exists) {
                    await deleteConversation(id);
                    await refreshHistory();
                } else {
                    setDraftItems((prev) => prev.filter((d) => d.id !== id));
                }
                if (activeConversationId === id) {
                    const next = visibleConversations.find((item) => item.id !== id)?.id;
                    setActiveConversationId(next);
                    if (next) onConversationSelect?.(next);
                }
            },
        });
    };

    const getUserInitial = () => {
        const base = currentUserName && currentUserName.trim().length > 0 ? currentUserName.trim() : 'U';
        return base.charAt(0).toUpperCase();
    };

    const getUserGradient = (isDark: boolean) => {
        const name = currentUserName || 'user';
        let hash = 0;
        for (let i = 0; i < name.length; i += 1) {
            hash = (hash << 5) - hash + name.charCodeAt(i);
            hash |= 0;
        }
        const palette = isDark ? theme.aiChat.avatar.userPaletteDark : theme.aiChat.avatar.userPalette;
        const index = Math.abs(hash) % palette.length;
        return palette[index];
    };
    const renderBotAvatarSvg = () => {
        const size = theme.aiChat.avatar.size;
        const iconSize = theme.aiChat.avatar.iconSize;
        const center = size / 2;
        const iconHalf = iconSize / 2;
        return (
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="bot-avatar-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor={theme.aiChat.avatar.botGradientFrom}/>
                        <stop offset="100%" stopColor={theme.aiChat.avatar.botGradientTo}/>
                    </linearGradient>
                </defs>
                <circle
                    cx={center}
                    cy={center}
                    r={center - 2}
                    fill="url(#bot-avatar-gradient)"
                />
                <rect
                    x={center - iconHalf}
                    y={center - iconHalf}
                    rx={theme.radius.sm}
                    ry={theme.radius.sm}
                    width={iconSize}
                    height={iconSize}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={2}
                />
                <path
                    d={`M ${center - iconHalf + 6} ${center + 6} L ${center - iconHalf + 10} ${
                        center - 6
                    } L ${center - iconHalf + 14} ${center + 6} Z`}
                    fill="#ffffff"
                />
                <rect
                    x={center + 2}
                    y={center - 6}
                    width={2}
                    height={12}
                    fill="#ffffff"
                />
                <rect
                    x={center + 6}
                    y={center - 2}
                    width={6}
                    height={2}
                    fill="#ffffff"
                />
            </svg>
        );
    };

    const renderBotAvatar = () => (
        <ClassNames>
            {({css}) => (
                <div
                    className={css({
                        width: theme.aiChat.avatar.size,
                        height: theme.aiChat.avatar.size,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: `${botAvatarPulse} ${theme.motion.avatarPulseDuration}ms ease-in-out 0s 2`,
                    })}
                >
                    {renderBotAvatarSvg()}
                </div>
            )}
        </ClassNames>
    );

    const renderUserAvatar = () => (
        <ClassNames>
            {({css}) => {
                const [fromLight, toLight] = getUserGradient(false);
                const [fromDark, toDark] = getUserGradient(true);
                const className = css({
                    width: theme.aiChat.avatar.size,
                    height: theme.aiChat.avatar.size,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: theme.typography.headerWeightBold,
                    color: '#ffffff',
                    backgroundImage: `linear-gradient(135deg, ${fromLight}, ${toLight})`,
                    '@media (prefers-color-scheme: dark)': {
                        backgroundImage: `linear-gradient(135deg, ${fromDark}, ${toDark})`,
                        color: '#111827',
                    },
                });
                if (userAvatarUrl) {
                    return (
                        <img
                            src={userAvatarUrl}
                            alt={currentUserName || 'user avatar'}
                            className={className}
                        />
                    );
                }
                return (
                    <div className={className}>
                        {getUserInitial()}
                    </div>
                );
            }}
        </ClassNames>
    );

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
                                <Welcome title="加载失败" description={historyError} icon={renderBotAvatar()} />
                            ) : visibleConversations.length === 0 ? (
                                <Welcome title="暂无历史对话" description="点击右上角“新建”开始新的会话。" icon={renderBotAvatar()} />
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
                                    onActiveChange={async (id) => {
                                        setActiveConversationId(id);
                                        try {
                                            await markConversationRead(id);
                                            await refreshHistory();
                                        } catch {
                                            void 0;
                                        }
                                        onConversationSelect?.(id);
                                    }}
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
                                            icon={renderBotAvatar()}
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
                                                    avatar: renderBotAvatar(),
                                                    variant: 'outlined',
                                                    contentRender: (content, info) =>
                                                        renderMessageContent(String(content ?? ''), String(info.key ?? '')),
                                                },
                                                user: {
                                                    placement: 'end',
                                                    avatar: renderUserAvatar(),
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

