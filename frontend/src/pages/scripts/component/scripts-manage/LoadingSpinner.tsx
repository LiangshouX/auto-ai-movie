import React from 'react';

interface LoadingSpinnerProps {
  height?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ height = '70vh' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height,
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(99, 102, 241, 0.2)',
        borderTop: '3px solid var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
      }} />
      <div style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        letterSpacing: '0.1em',
        color: 'var(--color-primary)',
        textShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
      }}>LOADING...</div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;