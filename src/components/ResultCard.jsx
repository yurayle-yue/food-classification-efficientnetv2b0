import React from 'react';
import ConfidenceChart from './ConfidenceChart';

const ResultCard = ({ results, imageData, onReset, modelInfo, benchmark, allProbabilities }) => {
  if (!results || results.length === 0) return null;

  const topResult = results[0];
  const otherResults = results.slice(1, 5);

  return (
    <div className="result-card fade-in">
      {/* Header */}
      <div className="result-header">
        <div className="header-title">
          <h2>Hasil Klasifikasi</h2>
          <div className="header-meta">
            <div className="model-accuracy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{topResult.confidence}%</span>
            </div>
            {benchmark && (
              <div className="benchmark-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{benchmark.totalTime}ms</span>
              </div>
            )}
          </div>
        </div>
        <button className="reset-button" onClick={onReset}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Ulangi
        </button>
      </div>

      {/* Content */}
      <div className="result-content">
        <div className="image-section">
          <div className="image-preview">
            <img src={imageData} alt="Uploaded food" />
            <div className="image-overlay">
              <span className="overlay-label">Gambar Input</span>
            </div>
          </div>

          {modelInfo && (
            <div className="model-details">
              <h4>Detail Model</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Arsitektur</span>
                  <span className="detail-value">{modelInfo.architecture}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Confidence</span>
                  <span className="detail-value accent">{topResult.confidence}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dataset</span>
                  <span className="detail-value">{modelInfo.dataset}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Kelas</span>
                  <span className="detail-value">{modelInfo.numClasses}</span>
                </div>
              </div>
            </div>
          )}

          {/* Benchmark */}
          {benchmark && (
            <div className="benchmark-section">
              <h4>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Benchmark
              </h4>
              <div className="benchmark-grid">
                <div className="bm-item">
                  <span className="bm-value">{benchmark.preprocessTime}ms</span>
                  <span className="bm-label">Preprocess</span>
                </div>
                <div className="bm-item">
                  <span className="bm-value">{benchmark.inferenceTime}ms</span>
                  <span className="bm-label">Inferensi</span>
                </div>
                <div className="bm-item">
                  <span className="bm-value">{benchmark.postprocessTime}ms</span>
                  <span className="bm-label">Postprocess</span>
                </div>
                <div className="bm-item total">
                  <span className="bm-value">{benchmark.totalTime}ms</span>
                  <span className="bm-label">Total</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="predictions">
          {/* Top Prediction */}
          <div className="top-prediction">
            <div className="prediction-badge">
              <span className="rank">#1</span>
              <span className="confidence-badge">{topResult.confidence}%</span>
            </div>
            <h3>{topResult.displayName}</h3>
            <p className="class-name">{topResult.className}</p>

            {topResult.confidence >= 80 && (
              <div className="confidence-indicator high">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Tingkat Kepercayaan Tinggi
              </div>
            )}
            {topResult.confidence >= 50 && topResult.confidence < 80 && (
              <div className="confidence-indicator medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Tingkat Kepercayaan Sedang
              </div>
            )}
            {topResult.confidence < 50 && (
              <div className="confidence-indicator low">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Tingkat Kepercayaan Rendah
              </div>
            )}
          </div>

          {/* Description */}
          {topResult.description && (
            <div className="info-card">
              <h4>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Deskripsi Makanan
              </h4>
              <p className="description-text">{topResult.description}</p>
            </div>
          )}

          {/* Nutrition */}
          {topResult.nutrition && (
            <div className="info-card nutrition-card">
              <div className="nutrition-header">
                <h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  Informasi Nilai Gizi
                </h4>
                <span className="serving-badge">{topResult.nutrition.takaran}</span>
              </div>
              <div className="nutrition-grid">
                <div className="nutrition-item calories">
                  <div className="nutrition-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <div className="nutrition-value">
                    <span className="value">{topResult.nutrition.kalori}</span>
                    <span className="label">Kalori <small>kcal</small></span>
                  </div>
                </div>
                <div className="nutrition-item protein">
                  <div className="nutrition-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 5v14M10 5v14M14 5v14M18 5v14" />
                    </svg>
                  </div>
                  <div className="nutrition-value">
                    <span className="value">{topResult.nutrition.protein}g</span>
                    <span className="label">Protein</span>
                  </div>
                </div>
                <div className="nutrition-item fat">
                  <div className="nutrition-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="nutrition-value">
                    <span className="value">{topResult.nutrition.lemak}g</span>
                    <span className="label">Lemak</span>
                  </div>
                </div>
                <div className="nutrition-item carbs">
                  <div className="nutrition-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12h20M12 2v20" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="nutrition-value">
                    <span className="value">{topResult.nutrition.karbohidrat}g</span>
                    <span className="label">Karbohidrat</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Predictions */}
          {otherResults.length > 0 && (
            <div className="info-card other-predictions">
              <h4>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                Prediksi Lainnya
              </h4>
              <div className="other-list">
                {otherResults.map((result) => (
                  <div key={result.rank} className="other-item">
                    <div className="other-info">
                      <span className="other-rank">#{result.rank}</span>
                      <span className="other-name">{result.displayName}</span>
                    </div>
                    <div className="other-bar-wrapper">
                      <div className="other-bar" style={{ width: `${Math.max(parseFloat(result.confidence), 2)}%` }} />
                    </div>
                    <span className="other-confidence">{result.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Distribution Chart */}
          <ConfidenceChart allProbabilities={allProbabilities} />
        </div>
      </div>

      <style jsx>{`
        .result-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 149, 86, 0.15);
          overflow: hidden;
          width: 100%;
          margin: 0 auto;
          border: 2px solid #D4CDB8;
          animation: slideUp 0.6s ease-out;
          position: relative;
        }

        .result-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #8B9556, #9CAF88, #8B9556);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: linear-gradient(135deg, rgba(139, 149, 86, 0.08), rgba(166, 123, 91, 0.05));
          border-bottom: 1px solid #EBE5DE;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .header-title h2 {
          margin: 0 0 0.35rem 0;
          font-size: 1.3rem;
          font-weight: 600;
          font-family: 'Segoe UI', 'Georgia', serif;
          color: #2c2c2c;
        }

        .header-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .model-accuracy, .benchmark-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          padding: 0.3rem 0.7rem;
          border-radius: 14px;
          font-family: 'Segoe UI', 'Georgia', serif;
          font-weight: 600;
        }

        .model-accuracy {
          background: rgba(139, 149, 86, 0.1);
          border: 1px solid #9CAF88;
          color: #4A5D3A;
        }

        .benchmark-badge {
          background: rgba(107, 143, 206, 0.1);
          border: 1px solid #6B8FCE;
          color: #5A7DB5;
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #8B9556, #7A8449);
          border: none;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 3px 10px rgba(139, 149, 86, 0.2);
          font-family: 'Segoe UI', 'Georgia', serif;
          border-radius: 20px;
          font-size: 0.82rem;
        }

        .reset-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(139, 149, 86, 0.3);
        }

        /* Content */
        .result-content {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .image-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .image-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(139, 149, 86, 0.12);
          aspect-ratio: 1;
          border: 2px solid #9CAF88;
        }

        .image-preview img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }

        .image-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(44, 44, 44, 0.8));
          padding: 0.6rem;
        }

        .overlay-label {
          color: #FAF7F2;
          font-size: 0.72rem;
          font-weight: 500;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .model-details, .benchmark-section {
          background: rgba(139, 149, 86, 0.06);
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid #EBE5DE;
        }

        .model-details h4, .benchmark-section h4 {
          color: #2c2c2c;
          margin: 0 0 0.7rem 0;
          font-size: 0.85rem;
          font-family: 'Segoe UI', 'Georgia', serif;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .benchmark-section h4 svg { color: #6B8FCE; }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .detail-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 0.5rem 0.65rem;
          border-radius: 8px;
          border: 1px solid #EBE5DE;
        }

        .detail-label {
          display: block;
          font-size: 0.62rem;
          color: #8B9556;
          margin-bottom: 0.1rem;
          letter-spacing: 0.5px;
        }

        .detail-value {
          display: block;
          font-weight: 500;
          color: #2c2c2c;
          font-family: 'Segoe UI', 'Georgia', serif;
          font-size: 0.82rem;
        }

        .detail-value.accent { color: #7A8449; }

        .benchmark-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .bm-item {
          text-align: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          border: 1px solid #EBE5DE;
        }

        .bm-item.total {
          grid-column: 1 / -1;
          background: rgba(107, 143, 206, 0.08);
          border-color: rgba(107, 143, 206, 0.2);
        }

        .bm-value {
          display: block;
          font-size: 1.05rem;
          font-weight: 700;
          color: #5A7DB5;
          font-family: 'Consolas', monospace;
        }

        .bm-item.total .bm-value { font-size: 1.2rem; }

        .bm-label {
          font-size: 0.65rem;
          color: #6B5D4F;
        }

        /* Predictions */
        .predictions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .top-prediction {
          text-align: center;
          padding: 1.5rem 1.25rem;
          background: linear-gradient(135deg, rgba(139, 149, 86, 0.1), rgba(156, 175, 136, 0.06));
          border-radius: 12px;
          border: 2px solid #9CAF88;
        }

        .prediction-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }

        .prediction-badge .rank {
          background: linear-gradient(135deg, #8B9556, #7A8449);
          color: white;
          padding: 0.35rem 0.85rem;
          border-radius: 16px;
          font-weight: 600;
          font-size: 0.88rem;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .prediction-badge .confidence-badge {
          background: rgba(122, 132, 73, 0.15);
          color: #7A8449;
          padding: 0.35rem 0.85rem;
          border-radius: 16px;
          font-weight: 600;
          font-size: 0.88rem;
          border: 1px solid #7A8449;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .top-prediction h3 {
          color: #2c2c2c;
          font-size: 1.85rem;
          margin: 0 0 0.4rem 0;
          font-weight: 600;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .class-name {
          color: #6B5D4F;
          font-size: 0.85rem;
          font-style: italic;
          margin-bottom: 0.85rem;
          opacity: 0.8;
        }

        .confidence-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 500;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .confidence-indicator.high { background: rgba(122, 132, 73, 0.12); color: #7A8449; border: 1px solid #7A8449; }
        .confidence-indicator.medium { background: rgba(196, 150, 58, 0.12); color: #C4963A; border: 1px solid #C4963A; }
        .confidence-indicator.low { background: rgba(196, 127, 107, 0.12); color: #C47F6B; border: 1px solid #C47F6B; }

        /* Info Cards */
        .info-card {
          background: rgba(139, 149, 86, 0.06);
          padding: 1.1rem;
          border-radius: 10px;
          border: 1px solid #EBE5DE;
        }

        .info-card h4 {
          color: #2c2c2c;
          margin: 0 0 0.7rem 0;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .info-card h4 svg { color: #8B9556; }

        .description-text {
          color: #4a4a4a;
          line-height: 1.6;
          margin: 0;
          font-size: 0.82rem;
        }

        .nutrition-card { border-color: #B8D4B8; }

        .nutrition-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.7rem;
        }

        .nutrition-header h4 { margin: 0; }

        .serving-badge {
          background: rgba(122, 132, 73, 0.15);
          color: #7A8449;
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
          font-size: 0.68rem;
          font-weight: 500;
          border: 1px solid #7A8449;
          white-space: nowrap;
        }

        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.6rem;
        }

        .nutrition-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.7rem;
          border-radius: 8px;
          border: 1px solid #EBE5DE;
        }

        .nutrition-icon {
          width: 34px; height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .nutrition-item.calories .nutrition-icon { color: #C47F6B; background: rgba(196, 127, 107, 0.12); }
        .nutrition-item.protein .nutrition-icon { color: #6B8FCE; background: rgba(107, 143, 206, 0.12); }
        .nutrition-item.fat .nutrition-icon { color: #C4963A; background: rgba(196, 150, 58, 0.12); }
        .nutrition-item.carbs .nutrition-icon { color: #7A8449; background: rgba(122, 132, 73, 0.12); }

        .nutrition-value .value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c2c2c;
          display: block;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .nutrition-value .label {
          font-size: 0.72rem;
          color: #6B5D4F;
        }

        .nutrition-value .label small {
          color: #8B9556;
          font-size: 0.6rem;
        }

        /* Other Predictions */
        .other-predictions { background: rgba(255, 255, 255, 0.6); }

        .other-list { display: flex; flex-direction: column; gap: 0.5rem; }

        .other-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.7rem;
          background: rgba(255, 255, 255, 0.85);
          border-radius: 8px;
          border: 1px solid #EBE5DE;
        }

        .other-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .other-rank {
          background: rgba(139, 149, 86, 0.12);
          color: #7A8449;
          padding: 0.15rem 0.4rem;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .other-name {
          font-size: 0.78rem;
          color: #2c2c2c;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .other-bar-wrapper {
          flex: 1;
          height: 5px;
          background: rgba(139, 149, 86, 0.1);
          border-radius: 3px;
          overflow: hidden;
          min-width: 30px;
        }

        .other-bar {
          height: 100%;
          background: linear-gradient(90deg, #9CAF88, #8B9556);
          border-radius: 3px;
          transition: width 0.6s ease-out;
        }

        .other-confidence {
          font-size: 0.72rem;
          font-weight: 600;
          color: #7A8449;
          min-width: 40px;
          text-align: right;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .result-content { grid-template-columns: 1fr; padding: 1.25rem; }
          .image-preview { aspect-ratio: 4/3; }
          .top-prediction h3 { font-size: 1.4rem; }
        }

        @media (max-width: 480px) {
          .result-header { padding: 1rem; flex-direction: column; align-items: flex-start; }
          .reset-button { width: 100%; justify-content: center; }
          .result-content { padding: 1rem; gap: 0.85rem; }
          .top-prediction { padding: 1.1rem; }
          .top-prediction h3 { font-size: 1.2rem; }
          .info-card { padding: 0.85rem; }
          .nutrition-grid { grid-template-columns: 1fr; }
          .detail-grid, .benchmark-grid { grid-template-columns: 1fr 1fr; gap: 0.4rem; }
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
