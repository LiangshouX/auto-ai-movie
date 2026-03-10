import { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal, Input } from 'antd';
import {
    deleteConversation,
    listConversations,
    markConversationRead,
    renameConversation,
} from '@/api/service/conversations.ts';
import type { ConversationSummary } from '@/api/types/conversation-types.ts';

export const useChatHistory = (sessionId?: string, onConversationSelect?: (id: string) => void) => {
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [historyItems, setHistoryItems] = useState<ConversationSummary[]>([]);
    const [draftItems, setDraftItems] = useState<ConversationSummary[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(sessionId);

    useEffect(() => {
        setActiveConversationId(sessionId);
    }, [sessionId]);

    const refreshHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const resp = await listConversations({ page: 1, size: 50 });
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

    useEffect(() => {
        void refreshHistory();
    }, [refreshHistory]);

    const generateConversationId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const handleCreateConversation = async () => {
        const id = generateConversationId();
        setDraftItems((prev) => [
            { id, title: '新对话', lastMessageAt: null, unreadCount: 0 },
            ...prev,
        ]);
        setHistoryOpen(true);
        setActiveConversationId(id);
        onConversationSelect?.(id);
    };

    const handleRenameConversation = async (id: string, currentTitle: string) => {
        let nextTitle = currentTitle;
        // Logic moved to component or kept here? 
        // Modal needs UI, but logic is here. 
        // We can return a function that returns a promise or handles the Modal.
        // But Modal is UI. Ideally hook shouldn't render Modal.
        // But for simplicity, we can use Modal.confirm here as it is imperative.
        
        return new Promise<void>((resolve) => {
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
                        setDraftItems((prev) => prev.map((d) => (d.id === id ? { ...d, title: trimmed } : d)));
                    }
                    resolve();
                },
            });
        });
    };

    const handleDeleteConversation = async (id: string) => {
        Modal.confirm({
            title: '删除会话',
            content: '删除后将无法恢复，确认继续？',
            okText: '删除',
            cancelText: '取消',
            okButtonProps: { danger: true },
            onOk: async () => {
                const exists = historyItems.some((item) => item.id === id);
                if (exists) {
                    await deleteConversation(id);
                    await refreshHistory();
                } else {
                    setDraftItems((prev) => prev.filter((d) => d.id !== id));
                }
                if (activeConversationId === id) {
                    // Calculate next visible conversation
                    const ids = new Set(historyItems.map((i) => i.id));
                    const visible = [...draftItems.filter((d) => !ids.has(d.id)), ...historyItems];
                    const next = visible.find((item) => item.id !== id)?.id;
                    setActiveConversationId(next);
                    if (next) onConversationSelect?.(next);
                }
            },
        });
    };
    
    const handleSelectConversation = async (id: string) => {
        setActiveConversationId(id);
        try {
            await markConversationRead(id);
            await refreshHistory();
        } catch {
            void 0;
        }
        onConversationSelect?.(id);
    };

    const visibleConversations = useMemo(() => {
        const ids = new Set(historyItems.map((i) => i.id));
        return [...draftItems.filter((d) => !ids.has(d.id)), ...historyItems];
    }, [draftItems, historyItems]);

    return {
        historyOpen,
        setHistoryOpen,
        historyLoading,
        historyError,
        visibleConversations,
        activeConversationId,
        handleCreateConversation,
        handleRenameConversation,
        handleDeleteConversation,
        handleSelectConversation,
        refreshHistory
    };
};
