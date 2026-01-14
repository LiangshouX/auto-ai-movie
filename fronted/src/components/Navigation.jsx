import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/">首页</Link></li>
        <li><Link to="/movies">电影</Link></li>
        <li><Link to="/search">搜索</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;