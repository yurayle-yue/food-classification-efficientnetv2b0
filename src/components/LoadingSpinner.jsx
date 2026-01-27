import React from 'react';

/**
 * Komponen Loading Spinner
 */
const LoadingSpinner = ({ message = 'Memproses...' }) => {
  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
        }

        .spinner-container {
          text-align: center;
          color: white;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1.5rem;
        }

        .loading-message {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 0;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .spinner {
            width: 50px;
            height: 50px;
          }

          .loading-message {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
