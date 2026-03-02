import type {ConversationListResponse, ConversationMessage} from '@/api/types/conversation-types.ts';

const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};

export const listConversations = async (params?: {page?: number; size?: number; keyword?: string}) => {
    const page = params?.page ?? 1;
    const size = params?.size ?? 20;
    const keyword = params?.keyword?.trim();
    const search = new URLSearchParams();
    search.set('page', String(page));
    search.set('size', String(size));
    if (keyword) search.set('keyword', keyword);

    const resp = await fetch(`/api/conversations?${search.toString()}`, {
        method: 'GET',
        headers: authHeaders(),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return (await resp.json()) as ConversationListResponse;
};

export const createConversation = async (payload?: {title?: string; projectId?: string}) => {
    const resp = await fetch('/api/conversations', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload ?? {}),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = (await resp.json()) as {id: string};
    return data.id;
};

export const renameConversation = async (conversationId: string, title: string) => {
    const resp = await fetch(`/api/conversations/${encodeURIComponent(conversationId)}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({title}),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
};

export const deleteConversation = async (conversationId: string) => {
    const resp = await fetch(`/api/conversations/${encodeURIComponent(conversationId)}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
};

export const getConversationMessages = async (conversationId: string) => {
    const resp = await fetch(`/api/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: 'GET',
        headers: authHeaders(),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return (await resp.json()) as ConversationMessage[];
};

export const markConversationRead = async (conversationId: string) => {
    const resp = await fetch(`/api/conversations/${encodeURIComponent(conversationId)}/read`, {
        method: 'POST',
        headers: authHeaders(),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
};

