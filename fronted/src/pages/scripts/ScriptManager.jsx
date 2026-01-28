import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/index.js';
import './ScriptManager.css';

const ScriptManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectSummary, setNewProjectSummary] = useState('');
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.projectApi.getAllProjects();
      setProjects(response.data || response);
      setLoading(false);
    } catch (err) {
      setError(err.message || '获取项目列表失败');
      setLoading(false);
      console.error('Error fetching projects:', err);
    }
  };
  
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('请输入项目名称');
      return;
    }
    
    try {
      const newProject = {
        title: newProjectName,
        description: newProjectSummary,
        status: 'draft'
      };
      
      await api.projectApi.createProject(newProject);
      setNewProjectName('');
      setNewProjectSummary('');
      setShowCreateModal(false);
      fetchProjects(); // 重新获取项目列表
    } catch (err) {
      setError(err.message || '创建项目失败');
      console.error('Error creating project:', err);
    }
  };
  
  const handleDeleteProject = async (id, projectName) => {
    if (!window.confirm(`确定要删除项目 "${projectName}" 吗？此操作不可撤销。`)) {
      return;
    }
    
    try {
      await api.projectApi.deleteProject(id);
      fetchProjects(); // 重新获取项目列表
    } catch (err) {
      setError(err.message || '删除项目失败');
      console.error('Error deleting project:', err);
    }
  };
  
  const handleUpdateProject = async (id, updates) => {
    try {
      await api.projectApi.updateProject(id, updates);
      fetchProjects(); // 重新获取项目列表
    } catch (err) {
      setError(err.message || '更新项目失败');
      console.error('Error updating project:', err);
    }
  };
  
  // 过滤项目列表
  const filteredProjects = projects.filter(project => 
    (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.summary && project.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <div className="header-section">
          <h2>AI 剧本项目管理</h2>
          <div className="controls">
            <button className="btn btn-danger" onClick={() => setError(null)}>关闭错误</button>
          </div>
        </div>
        <div className="error-message">
          <p>错误: {error}</p>
          <button className="btn btn-primary" onClick={fetchProjects}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <div className="script-manager-container">
      <div className="header-section">
        <h2>AI 剧本项目管理</h2>
        <div className="controls">
          <input 
            type="text" 
            placeholder="搜索项目..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>+ 新建项目</button>
        </div>
      </div>
      
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="project-card-wrapper">
              <Link to={`/scripts/editor/${project.id}`} className="project-card-link">
                <div className="project-card">
                  <div className="book-shape">
                    <div className="book-cover">
                      <h3>{project.title || project.name || '未命名项目'}</h3>
                      <p className="project-summary">{project.summary || '暂无摘要'}</p>
                      <span className="project-status">状态: {project.status || '未知'}</span>
                    </div>
                    <div className="book-spine"></div>
                    <div className="book-page"></div>
                  </div>
                  <div className="project-info">
                    <small>更新时间: {new Date(project.updatedAt || project.createdAt || project.created_at).toLocaleString()}</small>
                  </div>
                </div>
              </Link>
              <button 
                className="btn btn-danger btn-small" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteProject(project.id, project.name || project.title || '未命名项目');
                }}
              >
                删除
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>暂无剧本项目</h3>
            <p>{searchTerm ? '没有找到匹配的项目' : '点击新建按钮创建您的第一个AI剧本项目'}</p>
            {!searchTerm && <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>+ 新建项目</button>}
          </div>
        )}
      </div>
      
      {/* 创建项目模态框 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>创建新项目</h3>
            <div className="form-group">
              <label>项目名称:</label>
              <input 
                type="text" 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="输入项目名称"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>项目摘要:</label>
              <textarea 
                value={newProjectSummary}
                onChange={(e) => setNewProjectSummary(e.target.value)}
                placeholder="输入项目摘要"
                className="form-textarea"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleCreateProject}>创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptManager;