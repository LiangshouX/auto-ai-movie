import type {Meta, StoryObj} from '@storybook/react';
import {ThemeProvider} from '@emotion/react';
import {appTheme} from '@/theme';
import {AiChatPanel} from './AiChatPanel';
import type {AiMessage} from '@/api/types/ai-chat-types';

const meta: Meta<typeof AiChatPanel> = {
  title: 'Scripts/AiChatPanel',
  component: AiChatPanel,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AiChatPanel>;

const renderWithTheme = (args: React.ComponentProps<typeof AiChatPanel>) => (
  <ThemeProvider theme={appTheme}>
    <div style={{height: 600}}>
      <AiChatPanel {...args} />
    </div>
  </ThemeProvider>
);

const baseMessages: AiMessage[] = [
  {
    id: '1',
    role: 'user',
    text: '我想写一部校园悬疑剧，应该从哪里开始？',
    timestamp: Date.now(),
    status: 'sent',
  },
  {
    id: '2',
    role: 'assistant',
    text: '可以先从确立核心悬念、主要角色关系和时间线入手。',
    timestamp: Date.now(),
    status: 'sent',
  },
];

export const Default: Story = {
  render: renderWithTheme,
  args: {
    title: 'AI 剧情顾问',
    subtitle: '智能洞察 · 秒级响应 · 持续学习的剧本创作助手',
    sessionId: 'demo-session-1234567890',
    messages: baseMessages,
    thoughts: [],
    thoughtChains: [],
    conversations: [],
    inputMessage: '',
    onInputChange: () => {},
    onSend: () => {},
    disabledSend: true,
    currentUserName: '王小明',
  },
};

export const Mobile: Story = {
  render: renderWithTheme,
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
  args: {
    ...Default.args,
  },
};

export const EmptyWelcome: Story = {
  render: renderWithTheme,
  args: {
    ...Default.args,
    messages: [],
    inputMessage: '',
  },
};
