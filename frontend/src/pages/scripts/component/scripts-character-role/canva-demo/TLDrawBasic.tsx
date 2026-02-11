import { Tldraw } from 'tldraw'
import {useNavigate} from "react-router-dom";
import {Button, Layout, Space, Typography} from "antd";
import {HomeOutlined} from "@ant-design/icons";

const {Title} = Typography;
const {Header, Content} = Layout;

const BasicExample= () => {

    const navigate = useNavigate();

    return (
        <Layout style={{padding: '24px 0', height: '100vh'}}>
            <Header style={{
                backgroundColor: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px #f0f0f0',
                zIndex: 100,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                justifyContent: 'space-between',
                height: 64,
                top: 0,
                left: 0,
                right: 0,
                borderBottom: '1px solid #e0e0e0'
            }}>
                <Space size="large">
                    <Button onClick={() => navigate('/')} type="text" size="large"><HomeOutlined/> 首页</Button>
                    <Title level={2} style={{margin: 0, color: 'rgba(0, 0, 0, 0.88)'}}>画布Demo</Title>
                </Space>
            </Header>

            <Content style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#f9f9f9',
                minHeight: 'calc(100vh - 64px)',
                minWidth: 'max(1500px, calc(100vw - 200px))'
            }}>
                <div style={{
                    position: 'relative',
                    inset: 0,
                    flex: 1,
                }}>
                    <Tldraw/>
                </div>
            </Content>


        </Layout>

    )
}

export default BasicExample

