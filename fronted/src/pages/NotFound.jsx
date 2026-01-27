import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <h1>404 - 页面未找到</h1>
      <p>抱歉，您访问的页面不存在。</p>
      <button onClick={goHome} className="btn btn-primary">返回首页</button>
    </div>
  );
};

export default NotFound;