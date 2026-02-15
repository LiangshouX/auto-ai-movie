import React from 'react';
import {Card, Flex, Tag, Typography} from 'antd';
import {XProvider, Bubble, Welcome, Actions, Conversations, Think, ThoughtChain} from '@ant-design/x';
import {SendOutlined, HistoryOutlined, ClearOutlined} from '@ant-design/icons';
import {ClassNames, keyframes, useTheme} from '@emotion/react';
import {AiMessage, AiThought, AiThoughtChain, ConversationSession} from '@/api/types/ai-chat-types.ts';
import type {AppTheme} from '@/theme';

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
        conversations = [],
        inputMessage,
        onInputChange,
        onSend,
        // onClearHistory, // 暂时注释未使用的参数
        // onConversationSelect, // 暂时注释未使用的参数
        disabledSend = false,
        // isStreaming = false // 暂时注释未使用的参数
        currentUserName,
        userAvatarUrl,
    }
) => {
    const theme = useTheme() as AppTheme;
    const activeTab = 'chat'; // 固定显示聊天界面

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const headerTextEn = theme.aiChat.header.subLineEn;

    const headerFadeIn = keyframes`
        from {
            opacity: 0;
            transform: translateY(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    `;

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

    const renderAnimatedLine = (text: string, baseDelay: number) => {
        const duration = theme.motion.headerFadeInDuration;
        const charDelay = theme.motion.headerCharDelay;
        return (
            <ClassNames>
                {({css}) => (
                    <span>
                        {Array.from(text).map((char, index) => {
                            if (char === ' ') {
                                return ' ';
                            }
                            return (
                                <span
                                    key={`${char}-${index}-${baseDelay}`}
                                    className={css({
                                        display: 'inline-block',
                                        opacity: 0,
                                        animation: `${headerFadeIn} ${duration}ms ${theme.motion.easingEaseOutCubic} forwards`,
                                        animationDelay: `${baseDelay + index * charDelay}ms`,
                                    })}
                                >
                                    {char}
                                </span>
                            );
                        })}
                    </span>
                )}
            </ClassNames>
        );
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
                                <div
                                    className={css({
                                        marginTop: theme.spacing.sm,
                                        fontSize: theme.typography.headerSubtitleSize,
                                        fontWeight: theme.typography.headerWeightMedium,
                                        color: theme.color.textSecondary,
                                        lineHeight: 1.6,
                                    })}
                                >
                                    {renderAnimatedLine(headerTextEn, 0)}
                                </div>
                            </div>
                        )}
                    </ClassNames>
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
                    <div 
                        ref={messagesContainerRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            marginBottom: 16,
                            minHeight: 'calc(100vh - 300px)',
                            maxHeight: 'calc(100vh - 300px)'
                        }}>
                        {activeTab === 'chat' ? (
                            messages.length === 0 ? (
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
                                                        padding: '0 24px',
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
                                <Flex vertical gap={16}>
                                    {messages.map((message) => (
                                        <Bubble
                                            key={message.id}
                                            placement={message.role === 'user' ? 'end' : 'start'}
                                            avatar={message.role === 'assistant' ? renderBotAvatar() : renderUserAvatar()}
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
