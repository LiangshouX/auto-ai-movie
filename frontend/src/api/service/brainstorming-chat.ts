export type BrainstormingChatStreamRequest = {
    conversationId: string;
    message: string;
    enableSearch?: boolean;
};

export const fetchBrainstormingChatStream = async (
    request: BrainstormingChatStreamRequest,
    signal: AbortSignal,
) => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch('/api/v1/brainstorming/chat/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            conversationId: request.conversationId,
            message: request.message,
            enableSearch: request.enableSearch ?? true,
        }),
        signal,
    });
};

export const clearBrainstormingConversation = async (conversationId: string) => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch('/api/v1/brainstorming/clear', {
        method: 'POST',
        headers,
        body: JSON.stringify({conversationId}),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
};
