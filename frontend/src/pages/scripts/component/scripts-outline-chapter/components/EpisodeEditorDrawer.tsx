import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Drawer, Form, Input, Button, Space, message, Spin, Typography } from 'antd';
import { SaveOutlined, CloseOutlined, CheckCircleOutlined, LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { scriptsEpisodeApi } from '@/api/service/scripts-episode';
import type { OutlineEpisodeDTO } from '@/api/types/scripts-outline-types';
import type { ScriptEpisodeDTO } from '@/api/types/scripts-episode-types';
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
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  const lastSavedContent = useRef<string>('');
  const lastSavedTitle = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 获取桥段详细内容
  const fetchEpisodeContent = useCallback(async () => {
    if (!episode?.episodeId) return;
    
    console.log('[EpisodeEditor] Fetching content for:', episode.episodeId);
    setContentLoading(true);

    const setDefaultContent = () => {
        const defaultContent: ScriptEpisodeDTO = {
            id: episode.episodeId,
            projectId,
            chapterId,
            episodeNumber: episode.episodeNumber,
            episodeTitle: episode.episodeTitle,
            episodeContent: '',
            wordCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setEpisodeContent(defaultContent);
        form.setFieldsValue({
            episodeTitle: episode.episodeTitle,
            episodeContent: ''
        });
        lastSavedContent.current = '';
        lastSavedTitle.current = episode.episodeTitle;
    };

    try {
      const response = await scriptsEpisodeApi.getEpisodeById({ id: episode.episodeId });
      console.log('[EpisodeEditor] Fetch response:', response);
      
      if (response.success && response.data) {
        const data = response.data as ScriptEpisodeDTO;
        setEpisodeContent(data);
        form.setFieldsValue({
          episodeTitle: data.episodeTitle,
          episodeContent: data.episodeContent
        });
        lastSavedContent.current = data.episodeContent || '';
        lastSavedTitle.current = data.episodeTitle || '';
      } else {
        console.warn('[EpisodeEditor] Content not found or empty, creating default');
        setDefaultContent();
      }
      setSaveStatus('saved');
    } catch (error) {
      console.error('获取桥段内容失败:', error);
      // Initialize with default content on error so user can still edit/save
      setDefaultContent();
    } finally {
      setContentLoading(false);
    }
  }, [episode, form, projectId, chapterId]);

  // 保存桥段内容
  const performSave = async (values: any) => {
    // Check if we are in create mode (empty episodeId) or update mode
    const isCreate = !episode?.episodeId;
    const targetId = episodeContent?.id || episode?.episodeId;
    
    if (!isCreate && !targetId) {
        console.error('[EpisodeEditor] No target ID available for save');
        setLoading(false);
        return;
    }
    
    console.log('[EpisodeEditor] Performing save. Create mode:', isCreate, 'TargetID:', targetId);
    setSaveStatus('saving');
    
    try {
      let response;

      if (isCreate) {
          // Create new episode
          const createData = {
              projectId,
              chapterId,
              episodeNumber: episode?.episodeNumber || 1,
              episodeTitle: values.episodeTitle,
              episodeContent: values.episodeContent,
              wordCount: calculateWordCount(values.episodeContent)
          };
          console.log('[EpisodeEditor] Create payload:', createData);
          response = await scriptsEpisodeApi.createEpisode(createData);
      } else {
          // Update existing episode
          const updateData = {
            id: targetId!,
            episodeTitle: values.episodeTitle,
            episodeContent: values.episodeContent,
            wordCount: calculateWordCount(values.episodeContent)
          };
          console.log('[EpisodeEditor] Update payload:', updateData);
          response = await scriptsEpisodeApi.updateEpisode(updateData);
      }
      
      console.log('[EpisodeEditor] Save response:', response);
      
      if (response.success && response.data) {
        setEpisodeContent(response.data as ScriptEpisodeDTO);
        lastSavedContent.current = values.episodeContent;
        lastSavedTitle.current = values.episodeTitle;
        setSaveStatus('saved');
        onSave?.(response.data as ScriptEpisodeDTO);
      } else {
          setSaveStatus('error');
      }
    } catch (error) {
      console.error('保存桥段失败:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSave = async () => {
      console.log('[EpisodeEditor] Manual save initiated');
      setLoading(true);
      try {
          const values = await form.validateFields();
          await performSave(values);
          message.success('保存成功');
      } catch (error) {
          console.error('[EpisodeEditor] Manual save failed:', error);
          // Don't show success message if failed
      } finally {
          setLoading(false);
      }
  };

  const calculateWordCount = (content: string) => {
      // Remove HTML tags for word count
      const text = content.replace(/<[^>]*>/g, '');
      return text.length;
  };

  // Auto-save logic for Content (2 seconds debounce)
  const handleContentChange = (content: string) => {
    form.setFieldValue('episodeContent', content);
    
    if (content !== lastSavedContent.current) {
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            const values = form.getFieldsValue();
            performSave(values);
        }, 2000);
    }
  };

  // Auto-save logic for Title (300ms debounce)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      if (title !== lastSavedTitle.current) {
          setSaveStatus('unsaved');
          if (titleSaveTimeoutRef.current) {
              clearTimeout(titleSaveTimeoutRef.current);
          }
          titleSaveTimeoutRef.current = setTimeout(() => {
              const values = form.getFieldsValue();
              performSave(values);
          }, 300);
      }
  };

  // 监听桥段变化
  useEffect(() => {
    if (open && episode) {
      fetchEpisodeContent();
    } else {
      form.resetFields();
      setEpisodeContent(null);
      setSaveStatus('saved');
    }
    return () => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (titleSaveTimeoutRef.current) clearTimeout(titleSaveTimeoutRef.current);
    };
  }, [open, episode, fetchEpisodeContent, form]);

  const handleClose = () => {
    // If unsaved changes, maybe prompt? For now just close.
    form.resetFields();
    setEpisodeContent(null);
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
            disabled={contentLoading}
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
              onChange={handleTitleChange}
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
              字数统计: {calculateWordCount(form.getFieldValue('episodeContent') || '')} 字
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
