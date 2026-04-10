import React, { useState, useEffect } from 'react';
import tfjsService from '../services/tfjsService';

const DebugPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (isExpanded && tfjsService.isReady()) {
      setDebugInfo(tfjsService.getDebugInfo());
    }
  }, [isExpanded]);

  const refreshInfo = () => {
    if (tfjsService.isReady()) {
      setDebugInfo(tfjsService.getDebugInfo());
    }
  };

  return (
    <div className="debug-panel">
      <div className="debug-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="debug-toggle-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <div>
            <h4>Model Info & Debug Panel</h4>
            <p>Informasi teknis TensorFlow.js dan model</p>
          </div>
        </div>
        <svg
          className={`debug-arrow ${isExpanded ? 'expanded' : ''}`}
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isExpanded && debugInfo && (
        <div className="debug-content">
          <div className="debug-grid">
            <div className="debug-item">
              <span className="debug-label">TF.js Backend</span>
              <span className="debug-value highlight">{debugInfo.backend || 'N/A'}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">TF.js Version</span>
              <span className="debug-value">{debugInfo.tfVersion}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">WebGL Support</span>
              <span className={`debug-value ${debugInfo.webglSupport ? 'success' : 'error'}`}>
                {debugInfo.webglSupport ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Model Loaded</span>
              <span className={`debug-value ${debugInfo.modelLoaded ? 'success' : 'error'}`}>
                {debugInfo.modelLoaded ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Arsitektur</span>
              <span className="debug-value">{debugInfo.modelArchitecture}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Dataset</span>
              <span className="debug-value">{debugInfo.dataset}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Input Size</span>
              <span className="debug-value mono">{debugInfo.inputSize}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Jumlah Kelas</span>
              <span className="debug-value">{debugInfo.numClasses}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Active Tensors</span>
              <span className="debug-value mono">{debugInfo.numTensors}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Memory Usage</span>
              <span className="debug-value mono">{debugInfo.numBytesFormatted}</span>
            </div>
            <div className="debug-item full-width">
              <span className="debug-label">Input Nodes</span>
              <span className="debug-value mono small">{debugInfo.inputNodes.join(', ') || 'N/A'}</span>
            </div>
            <div className="debug-item full-width">
              <span className="debug-label">Output Nodes</span>
              <span className="debug-value mono small">{debugInfo.outputNodes.join(', ') || 'N/A'}</span>
            </div>
          </div>

          <button className="debug-refresh" onClick={refreshInfo}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Refresh Info
          </button>
        </div>
      )}

      <style jsx>{`
        .debug-panel {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          border: 2px solid #D4CDB8;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.1);
        }

        .debug-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.5rem;
          cursor: pointer;
          transition: background 0.2s ease;
          user-select: none;
        }

        .debug-toggle:hover { background: rgba(139, 149, 86, 0.04); }

        .debug-toggle-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          color: #4A5D3A;
        }

        .debug-toggle-left h4 {
          font-size: 0.98rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .debug-toggle-left p {
          font-size: 0.75rem;
          color: #6B5D4F;
          margin: 0.1rem 0 0 0;
        }

        .debug-arrow {
          color: #8B9556;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .debug-arrow.expanded { transform: rotate(180deg); }

        .debug-content {
          border-top: 1px solid #EBE5DE;
          padding: 1.25rem 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .debug-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .debug-item {
          background: rgba(139, 149, 86, 0.05);
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          border: 1px solid #EBE5DE;
        }

        .debug-item.full-width {
          grid-column: 1 / -1;
        }

        .debug-label {
          display: block;
          font-size: 0.65rem;
          color: #8B9556;
          margin-bottom: 0.15rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .debug-value {
          display: block;
          font-weight: 500;
          color: #2c2c2c;
          font-size: 0.85rem;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .debug-value.mono {
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 0.82rem;
        }

        .debug-value.small {
          font-size: 0.72rem;
          word-break: break-all;
        }

        .debug-value.highlight {
          color: #7A8449;
          font-weight: 700;
          text-transform: uppercase;
        }

        .debug-value.success { color: #7A8449; }
        .debug-value.error { color: #C47F6B; }

        .debug-refresh {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.85rem;
          border: 1px solid #D4CDB8;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          color: #7A8449;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .debug-refresh:hover {
          background: rgba(139, 149, 86, 0.1);
          border-color: #8B9556;
        }

        @media (max-width: 480px) {
          .debug-grid { grid-template-columns: 1fr; }
          .debug-content { padding: 1rem; }
          .debug-toggle { padding: 0.9rem 1.1rem; }
          .debug-toggle-left h4 { font-size: 0.88rem; }
        }
      `}</style>
    </div>
  );
};

export default DebugPanel;
