import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/index.js';
import './ScriptManager.css';

const ScriptManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.projectApi.getAllProjects();
        console.log('Projects:', response);
        setProjects(response.data || response); // 根据API响应格式处理数据
        setLoading(false);
      } catch (err) {
        setError(err.message || '获取项目列表失败');
        setLoading(false);
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="script-manager-container">
        <h2>加载中...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="script-manager-container">
        <h2>错误</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="script-manager-container">
      <h2>AI 剧本项目管理</h2>
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link key={project.id} to={`/scripts/editor/${project.id}`} className="project-card-link">
              <div className="project-card">
                <div className="book-shape">
                  <div className="book-cover">
                    <h3>{project.name || project.title || '未命名项目'}</h3>
                    <p className="project-summary">{project.summary || '暂无摘要'}</p>
                    <span className="project-status">状态: {project.status || '未知'}</span>
                  </div>
                  <div className="book-spine"></div>
                  <div className="book-page"></div>
                </div>
                <div className="project-info">
                  <small>更新时间: {new Date(project.updatedAt || project.updateTime || project.created_at).toLocaleString()}</small>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <h3>暂无剧本项目</h3>
            <p>点击新建按钮创建您的第一个AI剧本项目</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptManager;