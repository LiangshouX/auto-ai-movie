import { Link } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import './Header.css';

const { Header } = Layout;
const { Title } = Typography;

const HeaderComponent = () => {
  return (
    <Header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <Title level={1} className="logo-title">Auto AI Movie</Title>
        </Link>
      </div>
    </Header>
  );
};

export default HeaderComponent;