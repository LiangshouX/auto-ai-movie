import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/index.js';
import './style/ScriptEditor.css';

const ScriptEditor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 监听浏览器的 beforeunload 事件，防止意外离开页面
  useEffect(() => {
    const handleBeforeUnload = (event) => {
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
        const response = await api.projectApi.getProjectById(projectId);
        setProject(response.data || response);
        setLoading(false);
      } catch (err) {
        setError(err.message || '获取项目信息失败');
        setLoading(false);
        console.error('Error fetching project:', err);
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
        navigate('/scripts'); // 返回剧本管理页面
      }
    } else {
      navigate('/scripts'); // 直接返回剧本管理页面
    }
  };

  const handleGoHome = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('您有未保存的更改，确定要离开吗？');
      if (confirmLeave) {
        navigate('/'); // 返回首页
      }
    } else {
      navigate('/'); // 直接返回首页
    }
  };

  const handleSave = () => {
    // 这里应该添加实际的保存逻辑
    alert('保存成功！');
    setHasUnsavedChanges(false);
  };

  // 模拟编辑行为，实际上这里应该监听实际的编辑操作
  const handleContentChange = () => {
    setHasUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="script-editor-container">
        <header className="editor-header">
          <div className="navigation-buttons">
            <button className="nav-btn" onClick={handleBackClick}>← 返回</button>
            <button className="nav-btn" onClick={handleGoHome}>⌂ 首页</button>
          </div>
          <h2>加载中...</h2>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="script-editor-container">
        <header className="editor-header">
          <div className="navigation-buttons">
            <button className="nav-btn" onClick={handleBackClick}>← 返回</button>
            <button className="nav-btn" onClick={handleGoHome}>⌂ 首页</button>
          </div>
          <h2>错误</h2>
        </header>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="script-editor-container">
      <header className="editor-header">
        <div className="navigation-buttons">
          <button className="nav-btn" onClick={handleBackClick}>← 返回</button>
          <button className="nav-btn" onClick={handleGoHome}>⌂ 首页</button>
        </div>
        <h1>编辑项目: {project?.name || project?.title || '未命名项目'}</h1>
        <button className="save-btn" onClick={handleSave}>保存</button>
      </header>
      
      <div className="editor-content" onClick={handleContentChange}>
        {/* 这里是空的编辑器区域，后续可以根据需求填充具体的设计内容 */}
        <div className="editor-placeholder">
          <h3>AI 剧本编辑器</h3>
          <p>项目 ID: {projectId}</p>
          <p>项目名称: {project?.name || project?.title || '未命名项目'}</p>
          <p>这是一个预留的编辑界面，您可以在此处添加具体的剧本编辑功能</p>
        </div>
      </div>
    </div>
  );
};

export default ScriptEditor;