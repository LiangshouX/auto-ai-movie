import {Link} from 'react-router-dom';
import './Home.css'; // 引入样式文件

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>欢迎来到 Auto AI Movie 应用!</h1>
                <p>这是一个智能化的电影制作平台，帮助您轻松创建AI驱动的电影内容。</p>
            </div>
            
            <div className="feature-grid">
                <Link to="/scripts" className="feature-card">
                    <h2>📝 剧本管理</h2>
                    <p>创建和编辑您的电影剧本</p>
                </Link>
                
                <Link to="/movies" className="feature-card">
                    <h2>🎬 电影制作</h2>
                    <p>开始制作您的AI电影</p>
                </Link>
                
                <Link to="/search" className="feature-card">
                    <h2>🔍 内容搜索</h2>
                    <p>搜索相关内容和素材</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;