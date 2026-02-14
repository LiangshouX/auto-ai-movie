import { Link } from 'react-router-dom';
import { Row, Col, Card, Typography } from 'antd';
import './Home.css';

const Home = () => {
    const features = [
        { to: "/scripts", emoji: "📝", title: "剧本管理", desc: "从灵感到大纲，AI 助力打造引人入胜的故事情节" },
        { to: "/characters", emoji: "👤", title: "角色管理", desc: "多维塑造人物性格，构建复杂而生动的角色关系网" },
        { to: "/movies", emoji: "🎬", title: "电影制作", desc: "利用尖端 AI 技术，将文字剧本转化为视觉盛宴" },
        { to: "/search", emoji: "🔍", title: "内容搜索", desc: "海量素材库一键检索，为您的创作提供源源不断的灵感" },
        { to: "/tlDemo", emoji: "🎨", title: "画布调试", desc: "交互式可视化创作空间，自由探索创意的无限可能" },
    ];

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Auto AI Movie</h1>
                <p>下一代智能电影创作平台，让每一位创作者都能轻松驾驭 AI 的力量，开启电影制作的新纪元。</p>
            </div>

            <div className="feature-grid">
                <Row gutter={[24, 24]} justify="center" style={{ width: '100%' }}>
                    {features.map((feature, index) => (
                        <Col
                            key={`${feature.to}-${index}`}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            xl={6}
                            xxl={6}
                            style={{ display: 'flex' }}
                        >
                            <Link to={feature.to} style={{ flex: 1 }}>
                                <Card
                                    hoverable
                                    className="feature-card"
                                    styles={{ body: { padding: 0 } }}
                                    style={{ width: '100%', animationDelay: `${index * 0.1}s` as any }}
                                >
                                    <div style={{ padding: 28 }}>
                                        <div className="feature-icon">{feature.emoji}</div>
                                        <Typography.Title level={4} style={{ margin: '0 0 16px 0' }}>
                                            {feature.title}
                                        </Typography.Title>
                                        <Typography.Paragraph style={{ margin: 0 }}>
                                            {feature.desc}
                                        </Typography.Paragraph>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default Home;
