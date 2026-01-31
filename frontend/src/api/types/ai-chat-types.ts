// AI聊天消息类型
export interface AiMessage {
    id: string;
    text: string;
    role: 'user' | 'assistant';
    timestamp: number;
    status?: 'sending' | 'sent' | 'received' | 'error';
}

// AI思考过程类型
export interface AiThought {
    id: string;
    content: string;
    type: 'thinking' | 'planning' | 'analyzing' | 'reasoning';
    timestamp: number;
}

// AI执行链类型
export interface AiThoughtChain {
    id: string;
    thoughts: AiThought[];
    finalAnswer: string;
    timestamp: number;
}

// 对话会话类型
export interface ConversationSession {
    id: string;
    title: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
}

// 流式响应数据类型
export interface StreamResponse {
    type: 'message' | 'thought' | 'chain' | 'done';
    data: AiMessage | AiThought | AiThoughtChain;
    sessionId?: string;
}

// 创建默认消息对象
export const createDefaultMessage = (text: string, role: 'user' | 'assistant'): AiMessage => ({
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    role,
    timestamp: Date.now(),
    status: role === 'user' ? 'sending' : undefined
});

// 创建默认思考过程对象
export const createDefaultThought = (content: string, type: AiThought['type'] = 'thinking'): AiThought => ({
    id: `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    type,
    timestamp: Date.now()
});

// 创建默认对话会话对象
export const createDefaultConversation = (projectId: string, title: string = '新对话'): ConversationSession => ({
    id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messageCount: 0
});