import React from 'react';

/**
 * Komponen Loading Spinner dengan tema Farm-to-Table
 */
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
          background: rgba(250, 247, 242, 0.98);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .spinner-container {
          text-align: center;
          color: #2c2c2c;
        }

        .spinner-ring {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 4px solid transparent;
          border-top-color: #8B9556;
          border-right-color: #A67B5B;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          margin: 0 auto 1.5rem;
          position: relative;
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.2);
        }

        .spinner-ring::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          bottom: 8px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #9CAF88;
          border-left-color: #A67B5B;
          animation: spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
        }

        /* Leaf style center */
        .spinner-core {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #8B9556 0%, #A67B5B 50%, #8B9556 100%);
          border-radius: 50%;
          margin: -64px auto 1.5rem;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 4px 15px rgba(139, 149, 86, 0.3);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 4px 15px rgba(139, 149, 86, 0.3);
          }
          50% {
            transform: scale(1.2);
            opacity: 0.9;
            box-shadow: 0 6px 25px rgba(156, 175, 136, 0.4);
          }
        }

        .loading-message {
          font-size: 1.4rem;
          font-weight: 500;
          margin: 0 0 1rem 0;
          letter-spacing: 2px;
          font-family: 'Segoe UI', 'Georgia', serif;
          color: #2c2c2c;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .loading-dots span {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #8B9556 0%, #A67B5B 100%);
          border-radius: 50%;
          animation: bounce 1.6s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(139, 149, 86, 0.3);
        }

        .loading-dots span:nth-child(1) {
          animation-delay: 0s;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.7);
            opacity: 0.6;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 480px) {
          .spinner-ring {
            width: 70px;
            height: 70px;
          }

          .spinner-core {
            width: 18px;
            height: 18px;
            margin-top: -50px;
          }

          .loading-message {
            font-size: 1.1rem;
            padding: 0 1rem;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
