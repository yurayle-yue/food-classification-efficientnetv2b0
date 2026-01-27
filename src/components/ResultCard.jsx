import React from 'react';

/**
 * Komponen untuk menampilkan hasil prediksi dan informasi gizi
 */
const ResultCard = ({ results, imageData, onReset, modelInfo }) => {
  if (!results || results.length === 0) return null;

  const topResult = results[0];

  return (
    <div className="result-card fade-in">
      <div className="result-header">
        <div className="header-title">
          <h2>Hasil Klasifikasi</h2>
          {results && results.length > 0 && (
            <div className="model-accuracy">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Confidence: <strong>{results[0].confidence}%</strong></span>
            </div>
          )}
        </div>
        <button className="reset-button" onClick={onReset}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          Ulangi
        </button>
      </div>

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
                  <span className="detail-value accuracy">{topResult.confidence}%</span>
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
        </div>

        <div className="predictions">
          <div className="top-prediction">
            <div className="prediction-badge">
              <span className="rank">#1</span>
              <span className="confidence">{topResult.confidence}%</span>
            </div>
            <h3>{topResult.displayName}</h3>
            <p className="class-name">{topResult.className}</p>

            {topResult.confidence >= 80 && (
              <div className="confidence-indicator high">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Tingkat Kepercayaan Tinggi
              </div>
            )}
            {topResult.confidence >= 50 && topResult.confidence < 80 && (
              <div className="confidence-indicator medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Tingkat Kepercayaan Sedang
              </div>
            )}
            {topResult.confidence < 50 && (
              <div className="confidence-indicator low">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Tingkat Kepercayaan Rendah
              </div>
            )}
          </div>

          {topResult.nutrition && (
            <div className="nutrition-info">
              <div className="nutrition-header">
                <h4>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  Informasi Nilai Gizi
                </h4>
                <span className="serving-badge">{topResult.nutrition.takaran}</span>
              </div>
              <div className="nutrition-grid">
                <div className="nutrition-item calories">
                  <div className="nutrition-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <div className="nutrition-value">
                    <span className="value">{topResult.nutrition.kalori}</span>
                    <span className="label">Kalori</span>
                    <span className="unit">kcal</span>
                  </div>
                </div>

                <div className="nutrition-item protein">
                  <div className="nutrition-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <p className="nutrition-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Nilai gizi dapat bervariasi tergantung pada takaran dan cara penyajian
              </p>
            </div>
          )}

          {results.length > 1 && (
            <div className="other-predictions">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                Prediksi Lainnya
              </h4>
              <ul>
                {results.slice(1, 4).map((result) => (
                  <li key={result.className}>
                    <span className="rank">#{result.rank}</span>
                    <span className="name">{result.displayName}</span>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${result.confidence}%` }}></div>
                      <span className="confidence-value">{result.confidence}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .result-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          max-width: 1000px;
          margin: 0 auto;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-title {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .header-title h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .model-accuracy {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.95;
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid white;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reset-button:hover {
          background: white;
          color: #667eea;
          transform: translateY(-2px);
        }

        .result-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          padding: 2rem;
        }

        .image-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .image-preview {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          aspect-ratio: 1;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 1rem;
        }

        .overlay-label {
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .model-details {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
        }

        .model-details h4 {
          color: #1e293b;
          margin: 0 0 1rem 0;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .detail-item {
          background: white;
          padding: 0.75rem;
          border-radius: 8px;
        }

        .detail-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          display: block;
          font-weight: 600;
          color: #1e293b;
        }

        .detail-value.accuracy {
          color: #059669;
        }

        .predictions {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .top-prediction {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 16px;
          border: 2px solid #f59e0b;
        }

        .prediction-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .prediction-badge .rank {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1rem;
        }

        .prediction-badge .confidence {
          background: #ecfdf5;
          color: #059669;
          padding: 0.4rem 1rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1rem;
        }

        .top-prediction h3 {
          color: #1e293b;
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          font-weight: 800;
        }

        .class-name {
          color: #64748b;
          font-size: 1rem;
          font-family: monospace;
          margin-bottom: 1rem;
        }

        .confidence-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .confidence-indicator.high {
          background: #d1fae5;
          color: #065f46;
        }

        .confidence-indicator.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .confidence-indicator.low {
          background: #fee2e2;
          color: #991b1b;
        }

        .nutrition-info {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid #86efac;
        }

        .nutrition-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .nutrition-header h4 {
          color: #166534;
          margin: 0;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .serving-badge {
          background: #166534;
          color: white;
          padding: 0.35rem 0.85rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .nutrition-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease;
        }

        .nutrition-item:hover {
          transform: translateY(-2px);
        }

        .nutrition-item.calories .nutrition-icon {
          color: #ef4444;
          background: #fee2e2;
        }

        .nutrition-item.protein .nutrition-icon {
          color: #3b82f6;
          background: #dbeafe;
        }

        .nutrition-item.fat .nutrition-icon {
          color: #f59e0b;
          background: #fef3c7;
        }

        .nutrition-item.carbs .nutrition-icon {
          color: #10b981;
          background: #d1fae5;
        }

        .nutrition-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .nutrition-value {
          display: flex;
          flex-direction: column;
        }

        .nutrition-value .value {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
        }

        .nutrition-value .label {
          font-size: 0.85rem;
          color: #64748b;
        }

        .nutrition-value .unit {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .nutrition-note {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #86efac;
          color: #166534;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .other-predictions {
          background: #fffbeb;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #fed7aa;
        }

        .other-predictions h4 {
          color: #92400e;
          margin: 0 0 1rem 0;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .other-predictions ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .other-predictions li {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 0;
          border-bottom: 1px solid #fed7aa;
        }

        .other-predictions li:last-child {
          border-bottom: none;
        }

        .other-predictions .rank {
          color: #d97706;
          font-weight: 700;
          font-size: 0.9rem;
          min-width: 30px;
        }

        .other-predictions .name {
          flex: 1;
          color: #78350f;
        }

        .confidence-bar {
          flex: 1;
          height: 8px;
          background: #fed7aa;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          max-width: 100px;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .other-predictions .confidence-value {
          color: #92400e;
          font-weight: 600;
          font-size: 0.85rem;
          min-width: 45px;
          text-align: right;
        }

        @media (max-width: 900px) {
          .result-content {
            grid-template-columns: 1fr;
          }

          .result-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .top-prediction h3 {
            font-size: 1.5rem;
          }

          .nutrition-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .result-header {
            padding: 1rem 1.5rem;
          }

          .result-header h2 {
            font-size: 1.25rem;
          }

          .result-content {
            padding: 1rem;
          }

          .top-prediction h3 {
            font-size: 1.25rem;
          }

          .detail-grid,
          .nutrition-grid {
            grid-template-columns: 1fr;
          }

          .nutrition-info,
          .other-predictions,
          .model-details {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
