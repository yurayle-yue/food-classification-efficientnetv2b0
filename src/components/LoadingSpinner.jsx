import React from 'react';

const LoadingSpinner = ({ message = 'Memuat...' }) => {
  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner-ring"></div>
        <div className="spinner-core"></div>
        <p className="loading-message">{message}</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(250, 247, 242, 0.97);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .spinner-container {
          text-align: center;
          padding: 2rem;
          max-width: 320px;
        }

        .spinner-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #8B9556;
          border-right-color: #A67B5B;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          margin: 0 auto 1.25rem;
          position: relative;
        }

        .spinner-ring::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          bottom: 6px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #9CAF88;
          border-left-color: #A67B5B;
          animation: spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
        }

        .spinner-core {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #8B9556, #A67B5B);
          border-radius: 50%;
          margin: -52px auto 1.25rem;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 3px 10px rgba(139, 149, 86, 0.25);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }

        .loading-message {
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0 0 0.85rem 0;
          letter-spacing: 1px;
          font-family: 'Segoe UI', 'Georgia', serif;
          color: #2c2c2c;
          line-height: 1.4;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .loading-dots span {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #8B9556, #A67B5B);
          border-radius: 50%;
          animation: bounce 1.6s ease-in-out infinite;
        }

        .loading-dots span:nth-child(1) { animation-delay: 0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 480px) {
          .spinner-container {
            padding: 1.5rem;
          }

          .spinner-ring {
            width: 56px;
            height: 56px;
          }

          .spinner-core {
            width: 14px;
            height: 14px;
            margin-top: -42px;
          }

          .loading-message {
            font-size: 0.92rem;
            letter-spacing: 0.5px;
          }

          .loading-dots span {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
