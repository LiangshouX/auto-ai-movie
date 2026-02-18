export type BrainstormingChatStreamRequest = {
    conversationId: string;
    message: string;
    enableSearch?: boolean;
};

export type BrainstormingChatStreamOptions = {
    signal: AbortSignal;
    timeoutMs?: number;
    maxRetries?: number;
    retryDelayMs?: number;
    onDelta: (delta: string) => void;
};

const isAbortError = (error: unknown) => {
    if (!error) return false;
    if (error instanceof DOMException && error.name === 'AbortError') return true;
    if (error instanceof Error && error.name === 'AbortError') return true;
    return false;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const backoffMs = (attempt: number, baseDelayMs: number) => {
    const base = Math.max(50, baseDelayMs);
    const exp = Math.min(3, attempt - 1);
    const jitter = 0.85 + Math.random() * 0.3;
    return Math.round(base * Math.pow(2, exp) * jitter);
};

export const extractDeltaText = (data: string) => {
    try {
        const json = JSON.parse(data) as any;
        const candidates = [
            json?.delta,
            json?.content,
            json?.text,
            json?.message,
            json?.data?.delta,
            json?.data?.content,
            json?.data?.text,
            json?.data?.message,
            json?.choices?.[0]?.delta?.content,
            json?.choices?.[0]?.message?.content,
        ];
        const text = candidates.find((item) => typeof item === 'string' && item.length > 0);
        if (typeof text === 'string') return text;
    } catch {
        // ignore
    }
    return data;
};

export const consumeBrainstormingStream = async (
    response: Response,
    signal: AbortSignal,
    onDelta: (delta: string) => void,
) => {
    if (!response.body) {
        throw new Error('No response body');
    }

    const contentType = response.headers.get('content-type') || '';
    const isSse = contentType.includes('text/event-stream');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        if (signal.aborted) {
            throw new DOMException('Aborted', 'AbortError');
        }
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        if (!isSse) {
            if (chunk) onDelta(chunk);
            continue;
        }

        buffer += chunk;
        while (true) {
            const sepIndex = buffer.indexOf('\n\n');
            if (sepIndex === -1) break;
            const rawEvent = buffer.slice(0, sepIndex);
            buffer = buffer.slice(sepIndex + 2);
            const dataLines = rawEvent
                .split('\n')
                .map((line) => line.trimEnd())
                .filter((line) => line.startsWith('data:'))
                .map((line) => line.slice(5).trimStart());
            if (dataLines.length === 0) continue;
            const data = dataLines.join('\n');
            if (!data) continue;
            if (data === '[DONE]') return;
            const delta = extractDeltaText(data);
            if (delta) onDelta(delta);
        }
    }
};

export const fetchBrainstormingChatStream = async (
    request: BrainstormingChatStreamRequest,
    signal: AbortSignal,
) => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
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

export const streamBrainstormingChat = async (
    request: BrainstormingChatStreamRequest,
    options: BrainstormingChatStreamOptions,
) => {
    const timeoutMs = options.timeoutMs ?? 15000;
    const maxRetries = options.maxRetries ?? 2;
    const retryDelayMs = options.retryDelayMs ?? 300;

    let attempt = 0;
    while (true) {
        if (options.signal.aborted) {
            throw new DOMException('Aborted', 'AbortError');
        }

        attempt += 1;
        const attemptController = new AbortController();
        const abortAttempt = () => attemptController.abort();
        options.signal.addEventListener('abort', abortAttempt, { once: true });

        let timeoutId: number | undefined;
        if (timeoutMs > 0) {
            timeoutId = window.setTimeout(() => {
                attemptController.abort();
            }, timeoutMs);
        }

        try {
            const response = await fetchBrainstormingChatStream(request, attemptController.signal);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            await consumeBrainstormingStream(response, attemptController.signal, options.onDelta);
            return;
        } catch (error) {
            const aborted = isAbortError(error) || options.signal.aborted;
            if (aborted) throw error;
            if (attempt > maxRetries + 1) throw error;
            await sleep(backoffMs(attempt, retryDelayMs));
        } finally {
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
            options.signal.removeEventListener('abort', abortAttempt);
        }
    }
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
