import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <h1>Auto AI Movie</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;