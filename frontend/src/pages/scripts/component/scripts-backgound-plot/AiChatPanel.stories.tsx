import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {AiChatPanel} from './AiChatPanel.tsx';
import type {AiMessage} from '@/api/types/ai-chat-types.ts';

const meta: Meta<typeof AiChatPanel> = {
    title: 'Scripts/AiChatPanel',
    component: AiChatPanel,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

type Story = StoryObj<typeof AiChatPanel>;

const makeText = (len: number) => {
    const base =
        '这是用于可视化测试的长文本。包含中文、English words、以及一个超长URL：https://example.com/very/long/path?with=query&and=parameters。';
    return Array.from({length: Math.ceil(len / base.length)})
        .map(() => base)
        .join('')
        .slice(0, len);
};

const makeMessages = (assistantTextLen: number): AiMessage[] => [
    {
        id: 'msg-user-1',
        role: 'user',
        text: '请生成一段超长AI回复，用于验证气泡不会截断。',
        timestamp: Date.now() - 10000,
        status: 'sent',
    },
    {
        id: 'msg-ai-1',
        role: 'assistant',
        text: makeText(assistantTextLen),
        timestamp: Date.now() - 8000,
        status: 'received',
    },
];

const PanelShell: React.FC<{assistantLen: number}> = ({assistantLen}) => {
    const [input, setInput] = React.useState('');
    return (
        <div style={{height: 720, padding: 24, boxSizing: 'border-box'}}>
            <AiChatPanel
                title="AI创作助手"
                subtitle="Storybook 可视化测试"
                sessionId="storybook-session"
                messages={makeMessages(assistantLen)}
                inputMessage={input}
                onInputChange={setInput}
                onSend={() => {}}
                isStreaming={false}
                disabledSend={!input.trim()}
            />
        </div>
    );
};

export const LongMessage1000: Story = {
    render: () => <PanelShell assistantLen={1200} />,
};

export const LongMessage6000: Story = {
    render: () => <PanelShell assistantLen={6000} />,
};

