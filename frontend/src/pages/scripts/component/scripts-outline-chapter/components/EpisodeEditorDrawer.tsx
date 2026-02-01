import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Space, message, Spin } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { scriptsEpisodeApi } from '@/api/service/scripts-episode';
import type { OutlineEpisodeDTO } from '@/api/types/scripts-outline-types';
import type { ScriptEpisodeDTO } from '@/api/types/scripts-episode-types';

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

  // 获取桥段详细内容
  const fetchEpisodeContent = async () => {
    if (!episode?.episodeId) return;
    
    setContentLoading(true);
    try {
      const response = await scriptsEpisodeApi.getEpisodeById({ id: episode.episodeId });
      if (response.success && response.data) {
        setEpisodeContent(response.data as ScriptEpisodeDTO);
        form.setFieldsValue({
          episodeTitle: (response.data as ScriptEpisodeDTO).episodeTitle,
          episodeContent: (response.data as ScriptEpisodeDTO).episodeContent
        });
      } else {
        // 如果桥段内容不存在，创建默认内容
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
      }
    } catch (error) {
      console.error('获取桥段内容失败:', error);
      message.error('获取桥段内容失败');
    } finally {
      setContentLoading(false);
    }
  };

  // 保存桥段内容
  const handleSave = async () => {
    if (!episodeContent) return;
    
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      
      // 准备更新数据
      const updateData = {
        id: episodeContent.id,
        episodeTitle: values.episodeTitle,
        episodeContent: values.episodeContent,
        wordCount: values.episodeContent.length
      };
      
      let response;
      
      if (episodeContent.id && episodeContent.createdAt) {
        // 更新现有桥段
        response = await scriptsEpisodeApi.updateEpisode(updateData);
      } else {
        // 创建新桥段
        const createData = {
          projectId,
          chapterId,
          episodeNumber: episode?.episodeNumber || 1,
          episodeTitle: values.episodeTitle,
          episodeContent: values.episodeContent,
          wordCount: values.episodeContent.length
        };
        response = await scriptsEpisodeApi.createEpisode(createData);
      }
      
      if (response.success && response.data) {
        message.success('保存成功');
        setEpisodeContent(response.data as ScriptEpisodeDTO);
        onSave?.(response.data as ScriptEpisodeDTO);
      }
    } catch (error) {
      console.error('保存桥段失败:', error);
      message.error('保存桥段失败');
    } finally {
      setLoading(false);
    }
  };

  // 监听桥段变化
  useEffect(() => {
    if (open && episode) {
      fetchEpisodeContent();
    } else {
      form.resetFields();
      setEpisodeContent(null);
    }
  }, [open, episode]);

  const handleClose = () => {
    form.resetFields();
    setEpisodeContent(null);
    onClose();
  };

  return (
    <Drawer
      title={`编辑桥段 #${episode?.episodeNumber || ''}`}
      placement="right"
      width={700}
      open={open}
      onClose={handleClose}
      destroyOnClose
      extra={
        <Space>
          <Button 
            icon={<CloseOutlined />} 
            onClick={handleClose}
          >
            取消
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={loading}
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
          onFinish={handleSave}
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
              onPressEnter={handleSave}
            />
          </Form.Item>
          
          <Form.Item
            name="episodeContent"
            label="桥段内容"
            rules={[
              { required: true, message: '请输入桥段内容' }
            ]}
          >
            <Input.TextArea
              placeholder="请输入桥段详细内容..."
              autoSize={{ minRows: 15, maxRows: 30 }}
              showCount
              maxLength={10000}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>
          
          {episodeContent && (
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              textAlign: 'right',
              marginTop: '-16px',
              marginBottom: '16px'
            }}>
              字数统计: {(form.getFieldValue('episodeContent') || '').length} 字
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