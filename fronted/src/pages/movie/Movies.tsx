import { useNavigate } from 'react-router-dom';
import './style/Movies.css';

const Movies = () => {
  const navigate = useNavigate();

  return (
    <div className="movies-container">
      <div className="header-section">
        <div className="navigation-buttons">
          <button className="nav-btn" onClick={() => navigate('/')}>⌂ 首页</button>
          <button className="nav-btn" onClick={() => navigate('/scripts')}>剧本管理</button>
        </div>
        <h2>电影制作</h2>
      </div>
      
      <div className="movies-content">
        <div className="movies-grid">
          <div className="movie-card">
            <div className="movie-thumbnail">
              <div className="thumbnail-placeholder">🎬</div>
            </div>
            <div className="movie-info">
              <h3>我的电影作品</h3>
              <p>创建您的第一部AI电影</p>
              <button className="btn btn-primary">开始制作</button>
            </div>
          </div>
          
          <div className="movie-card">
            <div className="movie-thumbnail">
              <div className="thumbnail-placeholder">🎥</div>
            </div>
            <div className="movie-info">
              <h3>模板电影</h3>
              <p>使用预设模板快速制作</p>
              <button className="btn btn-secondary">选择模板</button>
            </div>
          </div>
          
          <div className="movie-card">
            <div className="movie-thumbnail">
              <div className="thumbnail-placeholder">🎞️</div>
            </div>
            <div className="movie-info">
              <h3>历史作品</h3>
              <p>查看之前的电影作品</p>
              <button className="btn btn-secondary">浏览历史</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;