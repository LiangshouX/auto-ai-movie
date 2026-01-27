import {Link} from 'react-router-dom';
import './Home.css'; // 引入样式文件

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>欢迎来到 Auto AI Movie 应用!</h1>
                <p>这是一个智能化的电影制作平台，帮助您轻松创建AI驱动的电影内容。</p>
            </div>

            <div className="feature-section">
                <h2>快速开始</h2>
                <div className="button-grid">
                    {/*<Link to='/scripts' className="feature-card">*/}
                    {/*    <div className="card-icon">🎬</div>*/}
                    {/*    <h3>AI 剧本管理</h3>*/}
                    {/*    <p>创建和管理您的AI生成剧本项目</p>*/}
                    {/*</Link>*/}

                    {/*<Link to='/movies' className="feature-card">*/}
                    {/*    <div className="card-icon">🎥</div>*/}
                    {/*    <h3>电影制作</h3>*/}
                    {/*    <p>开始制作您的AI电影作品</p>*/}
                    {/*</Link>*/}

                    {/*<Link to='/search' className="feature-card">*/}
                    {/*    <div className="card-icon">🔍</div>*/}
                    {/*    <h3>内容搜索</h3>*/}
                    {/*    <p>搜索和发现精彩内容</p>*/}
                    {/*</Link>*/}
                </div>
            </div>
        </div>
    );
};

export default Home;