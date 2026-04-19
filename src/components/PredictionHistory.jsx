import React, { useState } from 'react';

const PredictionHistory = ({ history, feedbackStats, onClearAll, onDeleteItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!history || history.length === 0) return null;

  const totalFeedback = feedbackStats.correct + feedbackStats.wrong;
  const feedbackAccuracy = totalFeedback > 0
    ? ((feedbackStats.correct / totalFeedback) * 100).toFixed(1)
    : null;

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (window.confirm(`Hapus semua ${history.length} riwayat prediksi? Tindakan ini tidak bisa dibatalkan.`)) {
      onClearAll && onClearAll();
    }
  };

  const handleDelete = (id) => {
    onDeleteItem && onDeleteItem(id);
  };

  return (
    <div className="prediction-history">
      <div className="history-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="history-toggle-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <h4>Riwayat Prediksi <span className="history-count">{history.length}</span></h4>
            {feedbackAccuracy !== null && (
              <p>Akurasi user feedback: <strong>{feedbackAccuracy}%</strong> ({feedbackStats.correct}/{totalFeedback})</p>
            )}
          </div>
        </div>
        <div className="history-toggle-right">
          {history.length > 0 && (
            <button
              type="button"
              className="clear-all-btn"
              onClick={handleClearAll}
              title="Hapus semua riwayat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Hapus Semua</span>
            </button>
          )}
          <svg
            className={`history-arrow ${isExpanded ? 'expanded' : ''}`}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="history-content">
          {/* Feedback Stats */}
          {totalFeedback > 0 && (
            <div className="feedback-summary">
              <div className="fb-stat correct">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feedbackStats.correct} Benar</span>
              </div>
              <div className="fb-stat wrong">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>{feedbackStats.wrong} Salah</span>
              </div>
              <div className="fb-stat accuracy">
                <span className="accuracy-value">{feedbackAccuracy}%</span>
                <span>Akurasi</span>
              </div>
            </div>
          )}

          {/* History Table */}
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gambar</th>
                  <th>Prediksi</th>
                  <th>Confidence</th>
                  <th>Waktu</th>
                  <th>Status</th>
                  <th aria-label="Aksi"></th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((item, idx) => (
                  <tr key={item.id}>
                    <td>{history.length - idx}</td>
                    <td>
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt="" className="history-thumb" />
                      ) : (
                        <div className="history-thumb-placeholder" />
                      )}
                    </td>
                    <td>
                      <div className="history-pred">
                        <strong>{item.prediction}</strong>
                        {item.expectedFood && (
                          <span className={`expected-label ${item.prediction.toLowerCase().replace(/\s+/g, '_') === item.expectedFood ? 'match' : 'mismatch'}`}>
                            {item.prediction.toLowerCase().replace(/\s+/g, '_') === item.expectedFood ? 'Cocok!' : `Diharapkan: ${item.expectedFood}`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`conf-badge ${parseFloat(item.confidence) >= 80 ? 'high' : parseFloat(item.confidence) >= 50 ? 'med' : 'low'}`}>
                        {item.confidence}%
                      </span>
                    </td>
                    <td className="time-cell">{item.inferenceTime}ms</td>
                    <td>
                      {item.feedback === 'correct' && (
                        <span className="fb-icon correct" title="Benar">&#10003;</span>
                      )}
                      {item.feedback === 'wrong' && (
                        <span className="fb-icon wrong" title="Salah">&#10007;</span>
                      )}
                      {!item.feedback && (
                        <span className="fb-icon pending">-</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="row-delete-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Hapus entri ini"
                        aria-label="Hapus entri ini"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .prediction-history {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          border: 2px solid #D4CDB8;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.1);
        }

        .history-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.5rem;
          cursor: pointer;
          transition: background 0.2s ease;
          user-select: none;
        }

        .history-toggle:hover { background: rgba(139, 149, 86, 0.04); }

        .history-toggle-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          color: #4A5D3A;
        }

        .history-toggle-left svg { flex-shrink: 0; }

        .history-toggle-left h4 {
          font-size: 0.98rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          font-family: 'Segoe UI', 'Georgia', serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .history-count {
          background: #8B9556;
          color: white;
          padding: 0.1rem 0.5rem;
          border-radius: 10px;
          font-size: 0.7rem;
        }

        .history-toggle-left p {
          font-size: 0.75rem;
          color: #6B5D4F;
          margin: 0.1rem 0 0 0;
        }

        .history-toggle-left p strong { color: #7A8449; }

        .history-toggle-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .clear-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.8rem;
          background: rgba(196, 127, 107, 0.08);
          border: 1px solid rgba(196, 127, 107, 0.4);
          border-radius: 8px;
          color: #C47F6B;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Segoe UI', 'Georgia', serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-all-btn:hover {
          background: rgba(196, 127, 107, 0.18);
          border-color: #C47F6B;
          color: #A56354;
        }

        .clear-all-btn svg { flex-shrink: 0; }

        .history-arrow {
          color: #8B9556;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .history-arrow.expanded { transform: rotate(180deg); }

        .row-delete-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          color: #A09888;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .row-delete-btn:hover {
          background: rgba(196, 127, 107, 0.12);
          border-color: rgba(196, 127, 107, 0.35);
          color: #C47F6B;
        }

        .history-content {
          border-top: 1px solid #EBE5DE;
          padding: 1.25rem 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .feedback-summary {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .fb-stat {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .fb-stat.correct {
          background: rgba(122, 132, 73, 0.12);
          color: #7A8449;
          border: 1px solid #7A8449;
        }

        .fb-stat.wrong {
          background: rgba(196, 127, 107, 0.12);
          color: #C47F6B;
          border: 1px solid #C47F6B;
        }

        .fb-stat.accuracy {
          background: rgba(107, 143, 206, 0.12);
          color: #5A7DB5;
          border: 1px solid #6B8FCE;
          gap: 0.3rem;
        }

        .accuracy-value { font-weight: 700; font-size: 1rem; }

        .history-table-wrapper {
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid #EBE5DE;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .history-table th {
          background: rgba(139, 149, 86, 0.1);
          padding: 0.6rem 0.7rem;
          text-align: left;
          font-weight: 600;
          color: #4A5D3A;
          white-space: nowrap;
          font-size: 0.72rem;
          letter-spacing: 0.5px;
        }

        .history-table td {
          padding: 0.5rem 0.7rem;
          border-top: 1px solid #EBE5DE;
          vertical-align: middle;
        }

        .history-table tr:hover { background: rgba(139, 149, 86, 0.04); }

        .history-thumb {
          width: 34px;
          height: 34px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #EBE5DE;
        }

        .history-thumb-placeholder {
          width: 34px;
          height: 34px;
          background: #EBE5DE;
          border-radius: 6px;
        }

        .history-pred strong {
          display: block;
          font-size: 0.82rem;
        }

        .expected-label {
          font-size: 0.68rem;
          font-weight: 500;
          padding: 0.1rem 0.4rem;
          border-radius: 6px;
          display: inline-block;
          margin-top: 0.15rem;
        }

        .expected-label.match {
          background: rgba(122, 132, 73, 0.15);
          color: #7A8449;
        }

        .expected-label.mismatch {
          background: rgba(196, 127, 107, 0.15);
          color: #C47F6B;
        }

        .conf-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-size: 0.72rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .conf-badge.high { background: rgba(122, 132, 73, 0.15); color: #7A8449; }
        .conf-badge.med { background: rgba(196, 150, 58, 0.15); color: #C4963A; }
        .conf-badge.low { background: rgba(196, 127, 107, 0.15); color: #C47F6B; }

        .time-cell {
          font-family: 'Consolas', monospace;
          font-size: 0.75rem;
          color: #6B5D4F;
        }

        .fb-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .fb-icon.correct { background: rgba(122, 132, 73, 0.15); color: #7A8449; }
        .fb-icon.wrong { background: rgba(196, 127, 107, 0.15); color: #C47F6B; }
        .fb-icon.pending { background: rgba(139, 149, 86, 0.08); color: #A09888; }

        @media (max-width: 480px) {
          .history-content { padding: 1rem; }
          .history-toggle { padding: 0.9rem 1.1rem; }
          .history-table { font-size: 0.72rem; }
          .history-thumb { width: 28px; height: 28px; }
          .fb-stat { font-size: 0.75rem; padding: 0.4rem 0.75rem; }
          .clear-all-btn span { display: none; }
          .clear-all-btn { padding: 0.4rem; }
          .history-toggle-right { gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default PredictionHistory;
