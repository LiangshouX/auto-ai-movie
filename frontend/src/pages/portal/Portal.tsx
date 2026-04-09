import {useEffect, useRef} from 'react';
import {Button} from 'antd';
import {useNavigate} from 'react-router-dom';
import './Portal.css';

const Portal = () => {
    const navigate = useNavigate();

    return (
        <div className="portal-page">
            <div className="portal-ambient-bg">
                <div className="ambient-orb orb-1"></div>
                <div className="ambient-orb orb-2"></div>
                <div className="ambient-orb orb-3"></div>
            </div>
            
            <div className="portal-grid-overlay"></div>
            
            <div className="portal-center">
                <div className="portal-content glass-panel">
                    <div className="portal-badge">NEXT GEN AI</div>
                    <h1 className="portal-title">Auto AI Movie</h1>
                    <p className="portal-subtitle">Transform your ideas into cinematic masterpieces with the power of artificial intelligence.</p>
                    
                    <div className="portal-actions">
                        <Button
                            type="primary"
                            size="large"
                            className="portal-enter-btn"
                            onClick={() => navigate('/workspace')}
                        >
                            Enter Workspace
                            <span className="btn-arrow">→</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portal;