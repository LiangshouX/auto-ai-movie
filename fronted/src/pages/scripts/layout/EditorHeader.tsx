import React from 'react';


interface EditorHeaderProps {
  title: string;
  projectTitle: string;
  onBackClick: () => void;
  onHomeClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onExportClick: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  projectTitle,
  onBackClick,
  onHomeClick,
  onSaveClick,
  onCancelClick,
  onExportClick
}) => {
  // const navigate = useNavigate(); // Removed unused variable

  return (
    <header className="editor-header">
      <div className="navigation-buttons">
        <button 
          className="nav-btn" 
          onClick={onBackClick}
          aria-label="返回上一页"
        >
          ← 返回
        </button>
        <button 
          className="nav-btn" 
          onClick={onHomeClick}
          aria-label="回到首页"
        >
          ⌂ 首页
        </button>
      </div>
      
      <div className="header-title">
        <h1>{title}</h1>
        <span className="project-name">正在编辑：{projectTitle || '未命名项目'}</span>
      </div>
      
      <div className="header-actions">
        <button 
          className="btn btn-export" 
          onClick={onExportClick}
          aria-label="导出剧本"
        >
          导出剧本
        </button>
        <button 
          className="btn btn-cancel" 
          onClick={onCancelClick}
          aria-label="取消编辑"
        >
          取消
        </button>
        <button 
          className="btn btn-save" 
          onClick={onSaveClick}
          aria-label="保存更改"
        >
          保存
        </button>
      </div>
    </header>
  );
};

export default EditorHeader;