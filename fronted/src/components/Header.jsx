import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <h1>Auto AI Movie</h1>
        </Link>
        <nav className="navigation">
          <ul>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/scripts">剧本管理</Link></li>
            <li><Link to="/movies">电影制作</Link></li>
            <li><Link to="/search">内容搜索</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;