import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const features = [
        { to: "/scripts", icon: "📝", title: "Script AI", desc: "From spark to outline, shape your narrative arc with intelligent generation.", size: "large" },
        { to: "/characters", icon: "👤", title: "Cast Studio", desc: "Build multidimensional characters and complex relationship webs.", size: "medium" },
        { to: "/movies", icon: "🎬", title: "Director's Cut", desc: "Translate written words into visual feasts with cutting-edge generation.", size: "large" },
        { to: "/search", icon: "🔍", title: "Asset Vault", desc: "Instantly retrieve inspiration from massive content libraries.", size: "small" },
        { to: "/tlDemo", icon: "🎨", title: "Canvas Lab", desc: "Interactive visual space for unbounded creativity.", size: "small" },
    ];

    return (
        <div className="home-container">
            <div className="home-ambient-glow"></div>
            
            <header className="hero-section">
                <div className="hero-badge">THE FUTURE OF CREATION</div>
                <h1>Auto AI Movie</h1>
                <p>The next-generation intelligent filmmaking platform. Harness the power of AI to forge your cinematic universe, from script to screen.</p>
            </header>

            <main className="bento-grid">
                {features.map((feature, index) => (
                    <Link 
                        to={feature.to} 
                        key={feature.to} 
                        className={`bento-card bento-${feature.size} glass-panel`}
                        style={{ animationDelay: `${0.1 * index}s` }}
                    >
                        <div className="bento-card-glow"></div>
                        <div className="bento-icon-wrapper">
                            <span className="bento-icon">{feature.icon}</span>
                        </div>
                        <div className="bento-content">
                            <h2 className="bento-title">{feature.title}</h2>
                            <p className="bento-desc">{feature.desc}</p>
                        </div>
                        <div className="bento-arrow">→</div>
                    </Link>
                ))}
            </main>
        </div>
    );
};

export default Home;