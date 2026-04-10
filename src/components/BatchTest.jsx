import React, { useRef, useState, useCallback } from 'react';
import tfjsService from '../services/tfjsService';

const BatchTest = ({ onBatchComplete, disabled }) => {
  const fileInputRef = useRef(null);
  const [batchResults, setBatchResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFilesSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    if (files.length > 20) {
      alert('Maksimal 20 gambar sekaligus.');
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: files.length });
    const results = [];

    for (let i = 0; i < files.length; i++) {
      setProgress({ current: i + 1, total: files.length });

      try {
        const dataUrl = await readFileAsDataUrl(files[i]);
        const img = await loadImage(dataUrl);
        const result = await tfjsService.predict(img);

        results.push({
          id: i,
          fileName: files[i].name,
          thumbnail: dataUrl,
          prediction: result.predictions[0].displayName,
          className: result.predictions[0].className,
          confidence: result.predictions[0].confidence,
          time: result.benchmark.totalTime,
          success: true
        });
      } catch (err) {
        results.push({
          id: i,
          fileName: files[i].name,
          thumbnail: null,
          prediction: 'Error',
          className: '',
          confidence: '0',
          time: 0,
          success: false,
          error: err.message
        });
      }
    }

    setBatchResults(results);
    setIsProcessing(false);

    if (onBatchComplete) {
      onBatchComplete(results);
    }

    e.target.value = '';
  }, [onBatchComplete]);

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const avgConfidence = batchResults.length > 0
    ? (batchResults.filter(r => r.success).reduce((sum, r) => sum + parseFloat(r.confidence), 0) / batchResults.filter(r => r.success).length).toFixed(1)
    : 0;

  const avgTime = batchResults.length > 0
    ? Math.round(batchResults.filter(r => r.success).reduce((sum, r) => sum + r.time, 0) / batchResults.filter(r => r.success).length)
    : 0;

  return (
    <div className="batch-test">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelect}
        style={{ display: 'none' }}
      />

      <div className="batch-header">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <div>
          <h3>Batch Test — Multi Gambar</h3>
          <p>Upload beberapa gambar sekaligus untuk pengujian massal (maks 20)</p>
        </div>
      </div>

      {!isProcessing && batchResults.length === 0 && (
        <div className="batch-upload-area">
          <button
            className="batch-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Pilih Beberapa Gambar
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="batch-progress">
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="progress-text">
            Memproses {progress.current} dari {progress.total} gambar...
          </p>
        </div>
      )}

      {!isProcessing && batchResults.length > 0 && (
        <div className="batch-results">
          <div className="batch-summary">
            <div className="summary-item">
              <span className="summary-value">{batchResults.length}</span>
              <span className="summary-label">Gambar</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{avgConfidence}%</span>
              <span className="summary-label">Rata-rata Confidence</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{avgTime}ms</span>
              <span className="summary-label">Rata-rata Waktu</span>
            </div>
          </div>

          <div className="batch-table-wrapper">
            <table className="batch-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gambar</th>
                  <th>Prediksi</th>
                  <th>Confidence</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {batchResults.map((r) => (
                  <tr key={r.id} className={r.success ? '' : 'error-row'}>
                    <td>{r.id + 1}</td>
                    <td>
                      <div className="batch-thumb-cell">
                        {r.thumbnail ? (
                          <img src={r.thumbnail} alt={r.fileName} className="batch-thumb" />
                        ) : (
                          <span className="thumb-error">!</span>
                        )}
                        <span className="batch-filename">{r.fileName}</span>
                      </div>
                    </td>
                    <td><strong>{r.prediction}</strong></td>
                    <td>
                      <span className={`conf-badge ${parseFloat(r.confidence) >= 80 ? 'high' : parseFloat(r.confidence) >= 50 ? 'med' : 'low'}`}>
                        {r.confidence}%
                      </span>
                    </td>
                    <td>{r.time}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="batch-reset-btn"
            onClick={() => { setBatchResults([]); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Test Lagi
          </button>
        </div>
      )}

      <style jsx>{`
        .batch-test {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          border: 2px solid #D4CDB8;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.1);
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .batch-header {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          margin-bottom: 1.25rem;
          color: #4A5D3A;
        }

        .batch-header svg { flex-shrink: 0; margin-top: 2px; }

        .batch-header h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .batch-header p {
          font-size: 0.82rem;
          color: #6B5D4F;
          margin: 0.2rem 0 0 0;
        }

        .batch-upload-area {
          text-align: center;
          padding: 1.5rem 0;
        }

        .batch-upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          background: linear-gradient(135deg, #8B9556, #7A8449);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Segoe UI', 'Georgia', serif;
          box-shadow: 0 3px 12px rgba(139, 149, 86, 0.25);
        }

        .batch-upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 16px rgba(139, 149, 86, 0.3);
        }

        .batch-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .batch-progress { text-align: center; padding: 1.5rem 0; }

        .progress-bar-wrapper {
          width: 100%;
          height: 8px;
          background: rgba(139, 149, 86, 0.15);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #8B9556, #9CAF88);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.85rem;
          color: #6B5D4F;
          font-style: italic;
        }

        .batch-summary {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .summary-item {
          flex: 1;
          min-width: 100px;
          text-align: center;
          padding: 0.85rem;
          background: rgba(139, 149, 86, 0.08);
          border-radius: 10px;
          border: 1px solid #EBE5DE;
        }

        .summary-value {
          display: block;
          font-size: 1.35rem;
          font-weight: 700;
          color: #7A8449;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .summary-label {
          font-size: 0.72rem;
          color: #6B5D4F;
        }

        .batch-table-wrapper {
          overflow-x: auto;
          margin-bottom: 1rem;
          border-radius: 10px;
          border: 1px solid #EBE5DE;
        }

        .batch-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .batch-table th {
          background: rgba(139, 149, 86, 0.1);
          padding: 0.65rem 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #4A5D3A;
          white-space: nowrap;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }

        .batch-table td {
          padding: 0.55rem 0.75rem;
          border-top: 1px solid #EBE5DE;
          vertical-align: middle;
        }

        .batch-table tr:hover { background: rgba(139, 149, 86, 0.04); }

        .error-row { background: rgba(196, 127, 107, 0.06); }

        .batch-thumb-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .batch-thumb {
          width: 36px;
          height: 36px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #EBE5DE;
          flex-shrink: 0;
        }

        .thumb-error {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(196, 127, 107, 0.15);
          color: #C47F6B;
          border-radius: 6px;
          font-weight: bold;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .batch-filename {
          font-size: 0.75rem;
          color: #6B5D4F;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 120px;
        }

        .conf-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .conf-badge.high { background: rgba(122, 132, 73, 0.15); color: #7A8449; }
        .conf-badge.med { background: rgba(196, 150, 58, 0.15); color: #C4963A; }
        .conf-badge.low { background: rgba(196, 127, 107, 0.15); color: #C47F6B; }

        .batch-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          background: rgba(139, 149, 86, 0.1);
          color: #7A8449;
          border: 1px solid #8B9556;
          border-radius: 10px;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .batch-reset-btn:hover {
          background: rgba(139, 149, 86, 0.2);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .batch-test { padding: 1.25rem; }
          .batch-filename { max-width: 80px; }
        }

        @media (max-width: 480px) {
          .batch-test { padding: 1rem; }
          .batch-table { font-size: 0.75rem; }
          .batch-thumb { width: 30px; height: 30px; }
          .summary-item { min-width: 80px; padding: 0.65rem; }
          .summary-value { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default BatchTest;
