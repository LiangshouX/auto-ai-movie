import {Link} from 'react-router-dom';
import './Home.css';

const Home = () => {
    const features = [
        { to: "/scripts", emoji: "📝", title: "剧本管理", desc: "创建和编辑您的电影剧本" },
        { to: "/scripts", emoji: '👤', title: "角色管理", desc: "创建和编辑您的人物角色" },
        { to: "/movies", emoji: "🎬", title: "电影制作", desc: "开始制作您的AI电影" },
        { to: "/search", emoji: "🔍", title: "内容搜索", desc: "搜索相关内容和素材" },
    ];

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>欢迎来到 Auto AI Movie 应用!</h1>
                <p>这是一个智能化的电影制作平台，帮助您轻松创建AI驱动的电影内容。</p>
            </div>
            
            <div className="feature-grid">
                {features.map((feature, index) => (
                    <Link 
                        key={feature.to} 
                        to={feature.to} 
                        className="feature-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <h2>{feature.emoji} {feature.title}</h2>
                        <p>{feature.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;