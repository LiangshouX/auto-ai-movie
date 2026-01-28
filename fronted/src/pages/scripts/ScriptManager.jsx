import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjectApi } from '../../hooks/useApi.js';
import './style/ScriptManager.css';

const ScriptManager = () => {
  const { 
    loading: apiLoading, 
    error: apiError, 
    getAllProjects, 
    createProject, 
    deleteProject 
  } = useProjectApi();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectSummary, setNewProjectSummary] = useState('');
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await getAllProjects(
        (data) => {
          // 正确处理API响应数据
          setProjects(Array.isArray(data) ? data : []);
        },
        (error) => {
          setError(error.message || '获取项目列表失败');
        }
      );
    } catch (err) {
      setError(err.message || '获取项目列表失败');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('请输入项目名称');
      return;
    }
    
    setOperationLoading(true);
    setError(null);
    
    try {
      const newProject = {
        title: newProjectName,
        description: newProjectSummary,
        status: 'DRAFT' // 使用大写状态值，与ProjectStatus保持一致
      };
      
      await createProject(
        newProject,
        () => {
          setNewProjectName('');
          setNewProjectSummary('');
          setShowCreateModal(false);
          fetchProjects(); // 重新获取项目列表
        },
        (error) => {
          setError(error.message || '创建项目失败');
        }
      );
    } catch (err) {
      setError(err.message || '创建项目失败');
      console.error('Error creating project:', err);
    } finally {
      setOperationLoading(false);
    }
  };
  
  const handleDeleteProject = async (id, projectName) => {
    if (!window.confirm(`确定要删除项目 "${projectName}" 吗？此操作不可撤销。`)) {
      return;
    }
    
    setOperationLoading(true);
    setError(null);
    
    try {
      await deleteProject(
        id,
        () => {
          fetchProjects(); // 重新获取项目列表
        },
        (error) => {
          setError(error.message || '删除项目失败');
        }
      );
    } catch (err) {
      setError(err.message || '删除项目失败');
      console.error('Error deleting project:', err);
    } finally {
      setOperationLoading(false);
    }
  };
  
  // 过滤项目列表
  const filteredProjects = projects.filter(project => 
    (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.summary && project.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || apiLoading) {
    return (
      <div className="script-manager-container">
        <div className="header-section">
          <h2>AI 剧本项目管理</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error || apiError) {
    const displayError = error || apiError;
    return (
      <div className="script-manager-container">
        <div className="header-section">
          <h2>AI 剧本项目管理</h2>
          <div className="controls">
            <button className="btn btn-danger" onClick={() => {
              setError(null);
              // 如果是apiError，我们可能需要额外处理
            }}>关闭错误</button>
          </div>
        </div>
        <div className="error-message">
          <p>错误: {displayError}</p>
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
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setShowCreateModal(true);
              setError(null); // 清除错误状态
            }}
            disabled={operationLoading || apiLoading}
          >
            {operationLoading || apiLoading ? '处理中...' : '+ 新建项目'}
          </button>
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
                disabled={operationLoading || apiLoading}
              >
                {operationLoading || apiLoading ? '...' : '删除'}
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>暂无剧本项目</h3>
            <p>{searchTerm ? '没有找到匹配的项目' : '点击新建按钮创建您的第一个AI剧本项目'}</p>
            {!searchTerm && (
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowCreateModal(true);
                  setError(null); // 清除错误状态
                }}
                disabled={operationLoading || apiLoading}
              >
                {operationLoading || apiLoading ? '处理中...' : '+ 新建项目'}
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* 创建项目模态框 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => {
          setShowCreateModal(false);
          setError(null); // 关闭模态框时清除错误状态
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>创建新项目</h3>
            
            {(error || apiError) && (
              <div className="error-message">
                <p>错误: {error || apiError}</p>
              </div>
            )}
            
            <div className="form-group">
              <label>项目名称:</label>
              <input 
                type="text" 
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value);
                  if ((error || apiError) && newProjectName.trim()) {
                    setError(null); // 输入变化时清除错误状态
                  }
                }}
                placeholder="输入项目名称"
                className="form-input"
                disabled={operationLoading || apiLoading}
              />
            </div>
            <div className="form-group">
              <label>项目摘要:</label>
              <textarea 
                value={newProjectSummary}
                onChange={(e) => setNewProjectSummary(e.target.value)}
                placeholder="输入项目摘要"
                className="form-textarea"
                disabled={operationLoading || apiLoading}
              />
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowCreateModal(false);
                  setError(null); // 关闭模态框时清除错误状态
                }}
                disabled={operationLoading || apiLoading}
              >
                取消
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateProject}
                disabled={operationLoading || apiLoading || !newProjectName.trim()}
              >
                {operationLoading || apiLoading ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptManager;