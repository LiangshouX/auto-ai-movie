import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Drawer, Form, Input, Button, Space, message, Spin, Typography } from 'antd';
import { SaveOutlined, CloseOutlined, CheckCircleOutlined, LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import apiClient from '@/api/request.ts';
import type { OutlineEpisodeDTO } from '@/api/types/scripts-outline-types';
import type { CreateScriptEpisodeData, ScriptEpisodeDTO, UpdateScriptEpisodeData } from '@/api/types/scripts-episode-types';
import { createClientNodeId } from '../utils/outline-utils';
import { TextEditorPanel } from '../../scripts-backgound-plot/TextEditorPanel';

const { Text } = Typography;

interface EpisodeEditorDrawerProps {
  open: boolean;
  onClose: () => void;
  episode: OutlineEpisodeDTO | null;
  projectId: string;
  chapterId: string;
  onSave?: (updatedEpisode: ScriptEpisodeDTO) => void;
}

type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved';

type DraftEpisode = {
  id?: string;
  draftKey: string;
  projectId: string;
  chapterId: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeContent: string;
  wordCount: number;
  createdAt?: string;
  updatedAt?: string;
};

type SaveQueueItem = {
  id: string;
  method: 'POST' | 'PUT';
  url: string;
  headers: Record<string, string>;
  body: any;
  createdAt: number;
  attempt: number;
};

const SAVE_QUEUE_KEY = 'episode_save_queue_v1';
const SAVE_QUEUE_MAX = 50;
const SAVE_QUEUE_MAX_ATTEMPT = 10;

const normalizeString = (v: unknown): string => (typeof v === 'string' ? v : '');

export const calculateWordCountSafe = (content?: unknown): number => {
  const raw = normalizeString(content);
  if (!raw) return 0;
  const text = raw.replace(/<[^>]*>/g, '');
  return text.length;
};

const loadSaveQueue = (): SaveQueueItem[] => {
  try {
    const raw = localStorage.getItem(SAVE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveSaveQueue = (items: SaveQueueItem[]) => {
  try {
    localStorage.setItem(SAVE_QUEUE_KEY, JSON.stringify(items.slice(0, SAVE_QUEUE_MAX)));
  } catch {
  }
};

const enqueueSave = (item: SaveQueueItem) => {
  const items = loadSaveQueue();
  saveSaveQueue([item, ...items]);
};

const isNetworkLikeError = (err: any) => {
  const status = err?.status ?? err?.originalError?.response?.status ?? null;
  if (status === null) return true;
  if (status >= 500) return true;
  return false;
};

const EpisodeEditorDrawer: React.FC<EpisodeEditorDrawerProps> = ({
  open,
  onClose,
  episode,
  projectId,
  chapterId,
  onSave
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [episodeContent, setEpisodeContent] = useState<ScriptEpisodeDTO | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [draftEpisode, setDraftEpisode] = useState<DraftEpisode | null>(null);
  const lastSavedContent = useRef<string>('');
  const lastSavedTitle = useRef<string>('');
  const abortRef = useRef<AbortController | null>(null);
  const unmountedRef = useRef(false);
  const flushingRef = useRef(false);

  const flushQueue = useCallback(async () => {
    if (flushingRef.current) return;
    if (!navigator.onLine) return;
    flushingRef.current = true;
    try {
      const items = loadSaveQueue();
      if (!items.length) return;
      const remain: SaveQueueItem[] = [];
      for (const item of items) {
        if (item.attempt >= SAVE_QUEUE_MAX_ATTEMPT) {
          remain.push(item);
          continue;
        }
        const controller = new AbortController();
        try {
          if (item.method === 'POST') {
            await apiClient.post(item.url, item.body, { headers: item.headers, signal: controller.signal });
          } else {
            await apiClient.put(item.url, item.body, { headers: item.headers, signal: controller.signal });
          }
        } catch {
          remain.push({ ...item, attempt: item.attempt + 1 });
        }
      }
      saveSaveQueue(remain);
    } finally {
      flushingRef.current = false;
    }
  }, []);

  const fetchEpisodeContent = useCallback(async () => {
    if (!episode) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setContentLoading(true);
    try {
      const baseDraft: DraftEpisode = {
        draftKey: createClientNodeId('episode'),
        projectId,
        chapterId,
        episodeNumber: episode.episodeNumber,
        episodeTitle: normalizeString(episode.episodeTitle),
        episodeContent: '',
        wordCount: 0
      };

      if (!episode.episodeId) {
        form.setFieldsValue({ episodeTitle: baseDraft.episodeTitle, episodeContent: '' });
        lastSavedContent.current = '';
        lastSavedTitle.current = baseDraft.episodeTitle;
        setEpisodeContent(null);
        setDraftEpisode(baseDraft);
        setSaveStatus('saved');
        return;
      }

      const response: any = await apiClient.get(`/v1/episodes/${episode.episodeId}`, { signal: controller.signal });
      const data = response?.data as ScriptEpisodeDTO | undefined;

      if (!data?.id) {
        form.setFieldsValue({ episodeTitle: baseDraft.episodeTitle, episodeContent: '' });
        lastSavedContent.current = '';
        lastSavedTitle.current = baseDraft.episodeTitle;
        setEpisodeContent(null);
        setDraftEpisode(baseDraft);
        setSaveStatus('saved');
        return;
      }

      const title = normalizeString(data.episodeTitle);
      const content = normalizeString(data.episodeContent);
      form.setFieldsValue({ episodeTitle: title, episodeContent: content });
      lastSavedContent.current = content;
      lastSavedTitle.current = title;
      setEpisodeContent(data);
      setDraftEpisode({
        ...baseDraft,
        id: data.id,
        projectId: data.projectId,
        chapterId: data.chapterId,
        episodeNumber: data.episodeNumber,
        episodeTitle: title,
        episodeContent: content,
        wordCount: calculateWordCountSafe(content),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
      setSaveStatus('saved');
    } catch (error: any) {
      if (controller.signal.aborted) return;
      message.warning('获取桥段内容失败，将以草稿模式打开');
      const title = normalizeString(episode.episodeTitle);
      form.setFieldsValue({ episodeTitle: title, episodeContent: '' });
      setEpisodeContent(null);
      setDraftEpisode({
        draftKey: createClientNodeId('episode'),
        projectId,
        chapterId,
        episodeNumber: episode.episodeNumber,
        episodeTitle: title,
        episodeContent: '',
        wordCount: 0
      });
      setSaveStatus('saved');
    } finally {
      setContentLoading(false);
    }
  }, [episode, form, projectId, chapterId]);

  const handleManualSave = async () => {
    if (loading || contentLoading) return;
    const localDraft = draftEpisode;
    if (!localDraft) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setSaveStatus('saving');
    try {
      const values = await form.validateFields();
      const title = normalizeString(values.episodeTitle);
      const content = normalizeString(values.episodeContent);
      const wordCount = calculateWordCountSafe(content);

      const idempotencyKey = localDraft.draftKey;
      const headers: Record<string, string> = {
        'Idempotency-Key': idempotencyKey,
        'X-Client-Request-Id': idempotencyKey
      };

      let saved: ScriptEpisodeDTO | null = null;
      if (!localDraft.id) {
        const payload: CreateScriptEpisodeData = {
          projectId,
          chapterId,
          episodeNumber: episode?.episodeNumber || 1,
          episodeTitle: title,
          episodeContent: content,
          wordCount
        };
        const response: any = await apiClient.post('/v1/episodes', payload, { headers, signal: controller.signal });
        saved = response?.data as ScriptEpisodeDTO;
      } else {
        const payload: UpdateScriptEpisodeData = {
          id: localDraft.id,
          episodeTitle: title,
          episodeContent: content,
          wordCount
        };
        const response: any = await apiClient.put(`/v1/episodes/${localDraft.id}`, payload, { headers, signal: controller.signal });
        saved = response?.data as ScriptEpisodeDTO;
      }

      if (!saved?.id) throw new Error('保存失败');
      if (saved.id.length > 32) throw new Error('桥段ID非法（长度需≤32），请检查后端ID生成策略');
      if (unmountedRef.current) return;

      setEpisodeContent(saved);
      lastSavedContent.current = content;
      lastSavedTitle.current = title;
      setDraftEpisode({
        ...localDraft,
        id: saved.id,
        episodeTitle: saved.episodeTitle,
        episodeContent: saved.episodeContent,
        wordCount: saved.wordCount,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt
      });
      setSaveStatus('saved');
      onSave?.(saved);
      message.success('保存成功');
      flushQueue();
    } catch (error: any) {
      if (controller.signal.aborted) return;
      setSaveStatus('error');
      if (isNetworkLikeError(error)) {
        const values = form.getFieldsValue();
        const title = normalizeString(values.episodeTitle);
        const content = normalizeString(values.episodeContent);
        const wordCount = calculateWordCountSafe(content);
        const idempotencyKey = localDraft.draftKey;
        const headers: Record<string, string> = {
          'Idempotency-Key': idempotencyKey,
          'X-Client-Request-Id': idempotencyKey
        };
        const method: 'POST' | 'PUT' = localDraft.id ? 'PUT' : 'POST';
        const url = localDraft.id ? `/v1/episodes/${localDraft.id}` : '/v1/episodes';
        const body = localDraft.id
          ? ({ id: localDraft.id, episodeTitle: title, episodeContent: content, wordCount } as UpdateScriptEpisodeData)
          : ({ projectId, chapterId, episodeNumber: episode?.episodeNumber || 1, episodeTitle: title, episodeContent: content, wordCount } as CreateScriptEpisodeData);
        enqueueSave({ id: idempotencyKey, method, url, headers, body, createdAt: Date.now(), attempt: 0 });
        message.warning('保存失败，已加入离线重发队列');
      } else {
        message.error(error?.message || '保存失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (content: string) => {
    form.setFieldValue('episodeContent', content);
    setDraftEpisode((prev) => {
      if (!prev) return prev;
      return { ...prev, episodeContent: content, wordCount: calculateWordCountSafe(content) };
    });
    if (content !== lastSavedContent.current) setSaveStatus('unsaved');
  };

  const onValuesChange = (_: any, allValues: any) => {
    const title = normalizeString(allValues?.episodeTitle);
    setDraftEpisode((prev) => {
      if (!prev) return prev;
      return { ...prev, episodeTitle: title };
    });
    if (title !== lastSavedTitle.current) setSaveStatus('unsaved');
  };

  useEffect(() => {
    const handler = () => flushQueue();
    window.addEventListener('online', handler);
    return () => window.removeEventListener('online', handler);
  }, [flushQueue]);

  useEffect(() => {
    unmountedRef.current = false;
    if (open && episode) fetchEpisodeContent();
    if (!open) {
      abortRef.current?.abort();
      form.resetFields();
      setEpisodeContent(null);
      setDraftEpisode(null);
      setSaveStatus('saved');
    }
    return () => {
      abortRef.current?.abort();
      unmountedRef.current = true;
    };
  }, [open, episode, fetchEpisodeContent, form]);

  useEffect(() => {
    if (open) flushQueue();
  }, [open, flushQueue]);

  const handleClose = () => {
    abortRef.current?.abort();
    form.resetFields();
    setEpisodeContent(null);
    setDraftEpisode(null);
    onClose();
  };

  const renderSaveStatus = () => {
      switch (saveStatus) {
          case 'saved':
              return <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /><Text type="secondary" style={{ fontSize: 12 }}>已保存</Text></Space>;
          case 'saving':
              return <Space><LoadingOutlined style={{ color: '#1890ff' }} /><Text type="secondary" style={{ fontSize: 12 }}>保存中...</Text></Space>;
          case 'error':
              return <Space><ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /><Text type="danger" style={{ fontSize: 12 }}>保存失败</Text></Space>;
          case 'unsaved':
              return <Text type="warning" style={{ fontSize: 12 }}>未保存</Text>;
          default:
              return null;
      }
  };

  return (
    <Drawer
      title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span>编辑桥段 #{episode?.episodeNumber || ''}</span>
              <div style={{ marginRight: 24 }}>{renderSaveStatus()}</div>
          </div>
      }
      placement="right"
      width={800}
      open={open}
      onClose={handleClose}
      destroyOnClose
      maskClosable={false} // Prevent accidental close
      extra={
        <Space>
          <Button 
            icon={<CloseOutlined />} 
            onClick={handleClose}
          >
            关闭
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleManualSave}
            loading={loading || saveStatus === 'saving'}
            disabled={contentLoading || loading}
          >
            保存
          </Button>
        </Space>
      }
    >
      <Spin spinning={contentLoading}>
        <Form
          form={form}
          layout="vertical"
          disabled={loading || contentLoading}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            name="episodeTitle"
            label="桥段标题"
            rules={[
              { required: true, message: '请输入桥段标题' },
              { max: 100, message: '标题长度不能超过100个字符' }
            ]}
          >
            <Input 
              placeholder="请输入桥段标题" 
              autoFocus
            />
          </Form.Item>
          
          <Form.Item
            name="episodeContent"
            label="桥段内容"
            rules={[
              { required: true, message: '请输入桥段内容' }
            ]}
          >
            <TextEditorPanel
                value={form.getFieldValue('episodeContent') || ''}
                onChange={handleContentChange}
                placeholder="请输入桥段详细内容..."
            />
          </Form.Item>
          
          {episodeContent && (
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              textAlign: 'right',
              marginTop: '8px'
            }}>
              字数统计: {calculateWordCountSafe(form.getFieldValue('episodeContent') || '')} 字
              {episodeContent.createdAt && (
                <span style={{ marginLeft: '16px' }}>
                  创建时间: {new Date(episodeContent.createdAt).toLocaleString()}
                </span>
              )}
              {episodeContent.updatedAt && (
                <span style={{ marginLeft: '16px' }}>
                  最后更新: {new Date(episodeContent.updatedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </Form>
        
        {!episodeContent && !contentLoading && (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            padding: '40px 0' 
          }}>
            加载中...
          </div>
        )}
      </Spin>
    </Drawer>
  );
};

export default EpisodeEditorDrawer;
