import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, Typography, Card, Alert, Spin, message, Flex } from 'antd';
import api from '../../../../api';
import { ScriptProject } from '@/api/types/project-types.ts';
import { projectApi } from '@/api/service/scripts-project.ts';
import EditorHeader from '../../layout/EditorHeader.tsx';
import SidebarNav from '../../layout/SidebarNav.tsx';
import BackgroundSetting from '../scripts-backgound-plot/BackgroundSetting.tsx';
import PlotSummary from '../scripts-backgound-plot/PlotSummary.tsx';
import CharacterDesign from '../scripts-character-role/CharacterDesign.tsx';
import ScriptOutline from '../scripts-outline-chapter/ScriptOutline.tsx';

const { Content } = Layout;
const { Title, Text } = Typography;

const ScriptEditor = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ScriptProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('background');
  // 存储各部分的内容
  const [contentData, setContentData] = useState({
    background: '',
    summary: ''
  });

  // 监听浏览器的 beforeunload 事件
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '您有未保存的更改，确定要离开吗？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response: any = await api.projectApi.getProjectById(projectId!);
        if (response.data) {
          const fetchedProject = response.data as ScriptProject;
          setProject(fetchedProject);
          // 初始化内容数据
          setContentData({
            background: fetchedProject.theme || '',
            summary: fetchedProject.summary || ''
          });
        } else {
          setProject(null);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || '获取项目信息失败');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('您有未保存的更改，确定要离开吗？');
      if (confirmLeave) {
        navigate('/scripts');
      }
    } else {
      navigate('/scripts');
    }
  };

  const handleGoHome = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('您有未保存的更改，确定要离开吗？');
      if (confirmLeave) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [hasUnsavedChanges, navigate]);

  const handleCancelClick = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm('您有未保存的更改，确定要取消吗？取消后所有更改将丢失。');
      if (confirmCancel) {
        if (project) {
          setContentData({
            background: project.theme || '',
            summary: project.summary || ''
          });
        }
        setHasUnsavedChanges(false);
      }
    }
  }, [hasUnsavedChanges, project]);

  const handleExportClick = useCallback(() => {
    alert('导出功能暂未实现');
  }, []);

  const handleSave = useCallback(async () => {
    if (!project || !hasUnsavedChanges) return;

    try {
      let updateData: Partial<ScriptProject> = {};
      
      switch (activeTab) {
        case 'background':
          updateData.theme = contentData.background;
          break;
        case 'summary':
          updateData.summary = contentData.summary;
          break;
        default:
          break;
      }

      await projectApi.updateProject(project.id!, updateData);
      
      setProject(prev => prev ? { ...prev, ...updateData } : null);
      setHasUnsavedChanges(false);
      message.success('保存成功！');
    } catch (err: any) {
      console.error('保存失败:', err);
      message.error(`保存失败: ${err.message || '未知错误'}`);
    }
  }, [project, hasUnsavedChanges, activeTab, contentData]);

  const handleContentChange = useCallback((tab: string, content: string) => {
    setContentData(prev => ({ ...prev, [tab]: content }));
    setHasUnsavedChanges(true);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'background':
        return (
          <BackgroundSetting 
            project={project} 
            onContentChange={(content) => handleContentChange('background', content)} 
          />
        );
      case 'summary':
        return (
          <PlotSummary 
            project={project} 
            onContentChange={(content) => handleContentChange('summary', content)} 
          />
        );
      case 'characters':
        return (
          <CharacterDesign project={project} />
        );
      case 'outline':
        return (
          <ScriptOutline projectTitle={project?.title || '未命名项目'} />
        );
      default:
        return (
          <Card>
            <Title level={3}>请选择左侧菜单项</Title>
            <Text>点击左侧菜单中的选项来开始编辑相应内容。</Text>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <Layout style={{ height: '100vh' }}>
        <EditorHeader
          title="剧本创作"
          projectTitle={project?.title || '加载中...'}
          onBackClick={handleBackClick}
          onHomeClick={handleGoHome}
          onSaveClick={handleSave}
          onCancelClick={handleCancelClick}
          onExportClick={handleExportClick}
        />
        <Content style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
          <Flex vertical align="center" justify="center" style={{ height: '100%', padding: 24 }}>
            <Spin size="large" tip="加载中..." />
            <Title level={3}>正在获取项目信息，请稍候</Title>
          </Flex>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ height: '100vh' }}>
        <EditorHeader
          title="剧本创作"
          projectTitle={project?.title || '错误'}
          onBackClick={handleBackClick}
          onHomeClick={handleGoHome}
          onSaveClick={handleSave}
          onCancelClick={handleCancelClick}
          onExportClick={handleExportClick}
        />
        <Content style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
          <Alert
            title="错误"
            description={error}
            type="error"
            showIcon
            action={
              <Button onClick={handleBackClick}>返回剧本管理</Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <EditorHeader
        title="剧本创作"
        projectTitle={project?.title || '未命名项目'}
        onBackClick={handleBackClick}
        onHomeClick={handleGoHome}
        onSaveClick={handleSave}
        onCancelClick={handleCancelClick}
        onExportClick={handleExportClick}
      />
      
      {/* 使用标准的Layout结构 - 修复布局问题 */}
      <Layout style={{ marginTop: 64 }}>
        <SidebarNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        {/*fixme: 小心，这里会缩起来*/}
        <Content style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: 24,
          display: 'flex',
          width: '100%',
          backgroundColor: '#f9f9f9',
          minHeight: 'calc(100vh - 64px)',
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ScriptEditor;