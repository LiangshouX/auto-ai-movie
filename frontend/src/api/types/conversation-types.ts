export type ConversationSummary = {
    id: string;
    title: string;
    lastMessageAt: string | null;
    unreadCount: number;
};

export type ConversationListResponse = {
    items: ConversationSummary[];
    total: number;
    page: number;
    size: number;
};

export type ConversationMessage = {
    role: 'user' | 'assistant' | string;
    content: string;
    timestamp: number;
};

