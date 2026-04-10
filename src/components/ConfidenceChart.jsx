import React, { useState } from 'react';

const ConfidenceChart = ({ allProbabilities }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCount, setShowCount] = useState(15);

  if (!allProbabilities || allProbabilities.length === 0) return null;

  const displayData = isExpanded
    ? allProbabilities.slice(0, showCount)
    : allProbabilities.slice(0, 10);

  const maxPercentage = parseFloat(allProbabilities[0]?.percentage || 100);

  return (
    <div className="confidence-chart">
      <div className="chart-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="chart-toggle-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <div>
            <h4>Distribusi Confidence (101 Kelas)</h4>
            <p>Visualisasi probabilitas semua kelas</p>
          </div>
        </div>
        <svg
          className={`chart-arrow ${isExpanded ? 'expanded' : ''}`}
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isExpanded && (
        <div className="chart-content">
          <div className="chart-bars">
            {displayData.map((item, idx) => {
              const barWidth = maxPercentage > 0
                ? Math.max((parseFloat(item.percentage) / maxPercentage) * 100, 0.5)
                : 0;

              return (
                <div key={item.className} className="chart-row">
                  <div className="chart-label">
                    <span className="chart-rank">#{idx + 1}</span>
                    <span className="chart-name" title={item.displayName}>{item.displayName}</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div
                      className={`chart-bar ${idx === 0 ? 'top' : ''}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="chart-value">{item.percentage}%</span>
                </div>
              );
            })}
          </div>

          {showCount < allProbabilities.length && (
            <div className="chart-show-more">
              <button onClick={() => setShowCount(prev => Math.min(prev + 20, 101))}>
                Tampilkan Lebih ({Math.min(showCount + 20, 101)} dari 101)
              </button>
              {showCount > 15 && (
                <button className="show-less" onClick={() => setShowCount(15)}>
                  Tampilkan Sedikit
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .confidence-chart {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          border: 1px solid #EBE5DE;
          overflow: hidden;
        }

        .chart-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: background 0.2s ease;
          user-select: none;
        }

        .chart-toggle:hover { background: rgba(139, 149, 86, 0.04); }

        .chart-toggle-left {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          color: #4A5D3A;
        }

        .chart-toggle-left h4 {
          font-size: 0.92rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .chart-toggle-left p {
          font-size: 0.72rem;
          color: #6B5D4F;
          margin: 0.1rem 0 0 0;
        }

        .chart-arrow {
          color: #8B9556;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .chart-arrow.expanded { transform: rotate(180deg); }

        .chart-content {
          padding: 0 1.25rem 1.25rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .chart-bars {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .chart-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chart-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          min-width: 130px;
          max-width: 130px;
        }

        .chart-rank {
          font-size: 0.65rem;
          color: #8B9556;
          font-weight: 600;
          min-width: 22px;
        }

        .chart-name {
          font-size: 0.72rem;
          color: #2c2c2c;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .chart-bar-wrapper {
          flex: 1;
          height: 14px;
          background: rgba(139, 149, 86, 0.08);
          border-radius: 7px;
          overflow: hidden;
          min-width: 50px;
        }

        .chart-bar {
          height: 100%;
          background: linear-gradient(90deg, #9CAF88, #8B9556);
          border-radius: 7px;
          transition: width 0.6s ease-out;
          min-width: 2px;
        }

        .chart-bar.top {
          background: linear-gradient(90deg, #8B9556, #7A8449);
        }

        .chart-value {
          font-size: 0.7rem;
          font-weight: 600;
          color: #7A8449;
          min-width: 50px;
          text-align: right;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .chart-show-more {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.85rem;
          flex-wrap: wrap;
        }

        .chart-show-more button {
          padding: 0.4rem 0.85rem;
          border: 1px solid #D4CDB8;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          color: #7A8449;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .chart-show-more button:hover {
          background: rgba(139, 149, 86, 0.1);
          border-color: #8B9556;
        }

        .chart-show-more .show-less {
          color: #A67B5B;
          border-color: #A67B5B;
        }

        @media (max-width: 480px) {
          .chart-label {
            min-width: 90px;
            max-width: 90px;
          }
          .chart-name { font-size: 0.65rem; }
          .chart-value { font-size: 0.65rem; min-width: 42px; }
          .chart-bar-wrapper { height: 12px; }
          .chart-toggle-left h4 { font-size: 0.82rem; }
        }
      `}</style>
    </div>
  );
};

export default ConfidenceChart;
