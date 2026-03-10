import React from 'react';
import { ClassNames, keyframes, useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';

export const BotAvatar = () => {
    const theme = useTheme() as AppTheme;

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

    return (
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
};

interface UserAvatarProps {
    currentUserName?: string;
    userAvatarUrl?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ currentUserName, userAvatarUrl }) => {
    const theme = useTheme() as AppTheme;

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

    return (
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
};
