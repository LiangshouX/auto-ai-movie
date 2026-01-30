import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './style/Search.css';
import {HomeOutlined} from "@ant-design/icons";

const Search = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [results, setResults] = useState<any[]>([]); // 在实际应用中，应替换为具体的类型
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = () => {
        if (!searchTerm.trim()) return;

        setLoading(true);

        // 模拟搜索过程
        setTimeout(() => {
            // 这里应该调用实际的搜索API
            setResults([
                {id: '1', title: '示例结果 1', type: '剧本', description: '这是一个示例搜索结果'},
                {id: '2', title: '示例结果 2', type: '电影', description: '另一个搜索结果'},
                {id: '3', title: '示例结果 3', type: '角色', description: '更多搜索结果'},
            ]);
            setLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-container">
            <div className="header-section">
                <div className="navigation-buttons">
                    <button className="nav-btn" onClick={() => navigate('/')}><HomeOutlined/> 首页</button>
                    <button className="nav-btn" onClick={() => navigate('/scripts')}>剧本管理</button>
                </div>
                <h2>内容搜索</h2>
            </div>

            <div className="search-content">
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="搜索剧本、电影、角色等..."
                        className="search-input"
                    />
                    <button
                        onClick={handleSearch}
                        className="btn btn-primary search-button"
                        disabled={loading}
                    >
                        {loading ? '搜索中...' : '搜索'}
                    </button>
                </div>

                <div className="search-results">
                    {results.length > 0 ? (
                        <div className="results-list">
                            {results.map((result) => (
                                <div key={result.id} className="result-item">
                                    <h3>{result.title}</h3>
                                    <span className="result-type">{result.type}</span>
                                    <p>{result.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <p>搜索中...</p>
                                </div>
                            ) : (
                                <p>输入关键词开始搜索</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;