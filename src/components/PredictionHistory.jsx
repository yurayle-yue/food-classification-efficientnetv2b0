import React, { useState } from 'react';

const PredictionHistory = ({ history, onClearAll, onDeleteItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [excludeColdStart, setExcludeColdStart] = useState(() => {
    try {
      const saved = localStorage.getItem('excludeColdStart');
      return saved === null ? true : JSON.parse(saved);
    } catch (e) {
      return true;
    }
  });

  if (!history || history.length === 0) return null;

  // Cold start detection:
  // - Entri baru: punya field item.isColdStart (di-set di App.jsx untuk prediksi pertama session)
  // - Entri lama (sebelum fitur ini): fallback ke entri tertua (history[0])
  const hasAnyColdStartFlag = history.some((item) => item.isColdStart === true);
  const isColdStartEntry = (item, originalIdx) => {
    if (item.isColdStart) return true;
    if (!hasAnyColdStartFlag && originalIdx === 0) return true;
    return false;
  };

  const sourceHistory = excludeColdStart
    ? history.filter((item, idx) => !isColdStartEntry(item, idx))
    : history;

  const inferenceSamples = sourceHistory
    .map((item) => Number(item.pureInferenceTime))
    .filter((v) => Number.isFinite(v) && v >= 0);
  const avgInference = inferenceSamples.length > 0
    ? Math.round(inferenceSamples.reduce((sum, v) => sum + v, 0) / inferenceSamples.length)
    : null;
  const skippedCount = excludeColdStart ? history.length - sourceHistory.length : 0;

  const handleToggleColdStart = (checked) => {
    setExcludeColdStart(checked);
    try {
      localStorage.setItem('excludeColdStart', JSON.stringify(checked));
    } catch (e) { /* ignore */ }
  };

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
          {/* Average Inference Summary */}
          {avgInference !== null ? (
            <div className="history-avg-banner">
              <div className="history-avg-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M7 14l4-4 4 4 5-5" />
                </svg>
                <span className="history-avg-label">Rata-rata Waktu Inferensi</span>
              </div>
              <div className="history-avg-right">
                <span className="history-avg-value">{avgInference}ms</span>
                <span className="history-avg-meta">
                  dari {inferenceSamples.length} pengujian
                  {skippedCount > 0 && (
                    <span className="history-avg-skip"> &middot; {skippedCount} cold start dilewati</span>
                  )}
                </span>
              </div>
            </div>
          ) : excludeColdStart && history.length > 0 && (
            <div className="history-avg-banner empty">
              <span className="history-avg-empty-text">
                Lakukan minimal 2 prediksi untuk melihat Rata-rata Waktu Inferensi (run #1 dilewati sebagai cold start).
              </span>
            </div>
          )}

          {/* Cold Start Toggle */}
          <label className="cold-start-toggle">
            <input
              type="checkbox"
              checked={excludeColdStart}
              onChange={(e) => handleToggleColdStart(e.target.checked)}
            />
            <span className="cold-start-text">
              <strong>Abaikan run pertama (cold start) dari rata-rata</strong>
              <small>
                Run #1 mengandung overhead WebGL shader compilation &amp; GPU memory allocation
                (sering ~100&ndash;200&times; lebih lambat). Praktik standar benchmarking: buang
                warm-up run agar rata-rata mencerminkan performa GPU yang sudah panas.
              </small>
            </span>
          </label>

          {/* History Table */}
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gambar</th>
                  <th>Prediksi</th>
                  <th>Confidence</th>
                  <th>Inferensi</th>
                  <th>Waktu</th>
                  <th aria-label="Aksi"></th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((item, idx) => {
                  const originalIdx = history.length - 1 - idx;
                  const coldStart = isColdStartEntry(item, originalIdx);
                  const isExcluded = coldStart && excludeColdStart;
                  return (
                  <tr key={item.id} className={isExcluded ? 'cold-start-row' : ''}>
                    <td>
                      <span>{history.length - idx}</span>
                      {coldStart && (
                        <span
                          className={`cold-badge ${isExcluded ? 'excluded' : ''}`}
                          title={isExcluded ? 'Cold start - dilewati dari rata-rata' : 'Cold start (run pertama session)'}
                        >
                          cold
                        </span>
                      )}
                    </td>
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
                      </div>
                    </td>
                    <td>
                      <span className={`conf-badge ${parseFloat(item.confidence) >= 80 ? 'high' : parseFloat(item.confidence) >= 50 ? 'med' : 'low'}`}>
                        {item.confidence}%
                      </span>
                    </td>
                    <td className="time-cell inference-cell">
                      {Number.isFinite(Number(item.pureInferenceTime)) ? `${item.pureInferenceTime}ms` : '-'}
                    </td>
                    <td className="time-cell">{item.inferenceTime}ms</td>
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
                  );
                })}
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

        .inference-cell {
          color: #4A5D3A;
          font-weight: 600;
        }

        .history-avg-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.1rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, rgba(139, 149, 86, 0.1), rgba(139, 149, 86, 0.04));
          border: 1px solid rgba(139, 149, 86, 0.3);
          border-radius: 10px;
        }

        .history-avg-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #4A5D3A;
        }

        .history-avg-left svg { flex-shrink: 0; }

        .history-avg-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #4A5D3A;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .history-avg-right {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .history-avg-value {
          font-family: 'Consolas', monospace;
          font-size: 1.15rem;
          font-weight: 700;
          color: #7A8449;
          letter-spacing: 0.5px;
        }

        .history-avg-meta {
          font-size: 0.7rem;
          color: #6B5D4F;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .history-avg-skip {
          color: #8B6F1A;
          font-weight: 600;
        }

        .history-avg-banner.empty {
          background: rgba(160, 152, 136, 0.08);
          border-color: rgba(160, 152, 136, 0.3);
          justify-content: flex-start;
        }

        .history-avg-empty-text {
          font-size: 0.78rem;
          color: #6B5D4F;
          font-family: 'Segoe UI', 'Georgia', serif;
          font-style: italic;
        }

        .cold-start-toggle {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid #EBE5DE;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .cold-start-toggle:hover {
          background: rgba(139, 149, 86, 0.05);
          border-color: rgba(139, 149, 86, 0.35);
        }

        .cold-start-toggle input[type="checkbox"] {
          margin-top: 0.18rem;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          accent-color: #8B9556;
          cursor: pointer;
        }

        .cold-start-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .cold-start-text strong {
          font-size: 0.84rem;
          color: #2c2c2c;
          font-weight: 600;
        }

        .cold-start-text small {
          font-size: 0.72rem;
          color: #6B5D4F;
          line-height: 1.5;
        }

        .cold-badge {
          display: inline-block;
          margin-left: 0.4rem;
          padding: 0.08rem 0.42rem;
          background: rgba(196, 150, 58, 0.18);
          color: #8B6F1A;
          border-radius: 8px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          vertical-align: middle;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .cold-badge.excluded {
          background: rgba(160, 152, 136, 0.22);
          color: #8B7B68;
        }

        .cold-start-row {
          opacity: 0.6;
          background: rgba(160, 152, 136, 0.05);
        }

        .cold-start-row .inference-cell {
          color: #8B7B68;
          text-decoration: line-through;
        }

        @media (max-width: 480px) {
          .history-content { padding: 1rem; }
          .history-toggle { padding: 0.9rem 1.1rem; }
          .history-table { font-size: 0.72rem; }
          .history-thumb { width: 28px; height: 28px; }
          .clear-all-btn span { display: none; }
          .clear-all-btn { padding: 0.4rem; }
          .history-toggle-right { gap: 0.5rem; }
          .history-avg-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4rem;
            padding: 0.75rem 0.9rem;
          }
          .history-avg-value { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default PredictionHistory;
