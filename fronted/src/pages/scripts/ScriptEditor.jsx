import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/index.js';
import './style/ScriptEditor.css';

const ScriptEditor = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="script-editor-container">
        <h2>加载中...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="script-editor-container">
        <h2>错误</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="script-editor-container">
      <header className="editor-header">
        <h1>编辑项目: {project?.name || project?.title || '未命名项目'}</h1>
        <button className="save-btn">保存</button>
      </header>
      
      <div className="editor-content">
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