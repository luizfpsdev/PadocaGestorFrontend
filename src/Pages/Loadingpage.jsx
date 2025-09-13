import React from 'react';

const LoadingPage = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
    }}>
        <div className="spinner" style={{
            width: 60,
            height: 60,
            border: '8px solid #f3f3f3',
            borderTop: '8px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: 20, fontSize: 18, color: '#555' }}>Carregando...</p>
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

export default LoadingPage;