import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Search.css';

const Search = () => {
  const navigate = useNavigate();

  return (
    <div className="search-container">
      <header className="page-header">
        <div className="navigation-buttons">
          <button className="nav-btn" onClick={() => navigate(-1)}>← 返回</button>
          <button className="nav-btn" onClick={() => navigate('/')}>⌂ 首页</button>
        </div>
        <h1>内容搜索</h1>
      </header>
      <p>正在开发中...</p>
    </div>
  );
};

export default Search;