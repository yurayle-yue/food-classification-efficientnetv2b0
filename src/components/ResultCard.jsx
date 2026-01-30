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

          {topResult.description && (
            <div className="description-info">
              <div className="description-header">
                <h4>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Deskripsi Makanan
                </h4>
              </div>
              <p className="description-text">{topResult.description}</p>
            </div>
          )}

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

        </div>
      </div>

      <style jsx>{`
        .result-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(139, 149, 86, 0.18);
          overflow: hidden;
          max-width: 1100px;
          margin: 0 auto;
          backdrop-filter: blur(10px);
          border: 2px solid #D4CDB8;
          animation: slideUp 0.6s ease-out;
          position: relative;
        }

        /* Decorative top border */
        .result-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #8B9556, #9CAF88, #8B9556);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2.5rem;
          background: linear-gradient(135deg, rgba(139, 149, 86, 0.1) 0%, rgba(166, 123, 91, 0.08) 100%);
          color: #2c2c2c;
          flex-wrap: wrap;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #EBE5DE;
        }

        /* Soft gradient effect */
        .result-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(139, 149, 86, 0.05) 0%, transparent 50%);
        }

        .header-title {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .header-title h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 600;
          position: relative;
          z-index: 1;
          letter-spacing: 1px;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .model-accuracy {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.95rem;
          background: rgba(139, 149, 86, 0.12);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid #9CAF88;
          position: relative;
          z-index: 1;
          color: #4A5D3A;
          letter-spacing: 0.5px;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 1.8rem;
          background: linear-gradient(135deg, #8B9556 0%, #7A8449 100%);
          border: none;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
          box-shadow: 0 4px 15px rgba(139, 149, 86, 0.3);
          letter-spacing: 0.5px;
          font-family: 'Segoe UI', 'Georgia', serif;
          border-radius: 25px;
        }

        .reset-button:hover {
          background: linear-gradient(135deg, #7A8449 0%, #6B7540 100%);
          box-shadow: 0 6px 20px rgba(139, 149, 86, 0.35);
          transform: translateY(-2px);
        }

        .reset-button:active {
          transform: translateY(0);
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
          box-shadow: 0 6px 25px rgba(139, 149, 86, 0.2);
          aspect-ratio: 1;
          border: 3px solid #9CAF88;
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
          background: linear-gradient(transparent, rgba(44, 44, 44, 0.9));
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .overlay-label {
          color: #FAF7F2;
          font-size: 0.85rem;
          font-weight: 500;
          font-family: 'Segoe UI', 'Georgia', serif;
          letter-spacing: 0.5px;
        }

        .model-details {
          background: rgba(139, 149, 86, 0.08);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #EBE5DE;
        }

        .model-details h4 {
          color: #2c2c2c;
          margin: 0 0 1rem 0;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.5px;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .detail-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #EBE5DE;
        }

        .detail-label {
          display: block;
          font-size: 0.75rem;
          color: #8B9556;
          margin-bottom: 0.25rem;
          letter-spacing: 0.5px;
        }

        .detail-value {
          display: block;
          font-weight: 500;
          color: #2c2c2c;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .detail-value.accuracy {
          color: #7A8449;
        }

        .predictions {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .top-prediction {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(139, 149, 86, 0.12) 0%, rgba(156, 175, 136, 0.08) 100%);
          border-radius: 16px;
          border: 2px solid #9CAF88;
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.15);
          position: relative;
          overflow: hidden;
        }

        /* Organic texture effect */
        .top-prediction::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.2;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%239CAF88' fill-opacity='0.3' cx='50' cy='50' r='40'/%3E%3C/svg%3E");
          background-size: 60px 60px;
        }

        .prediction-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 1.2rem;
          position: relative;
          z-index: 1;
        }

        .prediction-badge .rank {
          background: linear-gradient(135deg, #8B9556 0%, #7A8449 100%);
          color: white;
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(139, 149, 86, 0.3);
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .prediction-badge .confidence {
          background: rgba(122, 132, 73, 0.2);
          color: #7A8449;
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(122, 132, 73, 0.2);
          border: 1px solid #7A8449;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .top-prediction h3 {
          color: #2c2c2c;
          font-size: 2.5rem;
          margin: 0 0 0.75rem 0;
          font-weight: 600;
          letter-spacing: 1px;
          font-family: 'Segoe UI', 'Georgia', serif;
          position: relative;
          z-index: 1;
        }

        .class-name {
          color: #6B5D4F;
          font-size: 1.05rem;
          font-family: 'Segoe UI', 'Georgia', serif;
          margin-bottom: 1.2rem;
          font-weight: 400;
          opacity: 0.8;
          position: relative;
          z-index: 1;
          font-style: italic;
        }

        .confidence-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          position: relative;
          z-index: 1;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .confidence-indicator.high {
          background: rgba(122, 132, 73, 0.15);
          color: #7A8449;
          border: 1px solid #7A8449;
        }

        .confidence-indicator.medium {
          background: rgba(196, 150, 58, 0.15);
          color: #C4963A;
          border: 1px solid #C4963A;
        }

        .confidence-indicator.low {
          background: rgba(196, 127, 107, 0.15);
          color: #C47F6B;
          border: 1px solid #C47F6B;
        }

        .description-info {
          background: rgba(139, 149, 86, 0.08);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #EBE5DE;
          margin-top: 1rem;
        }

        .description-header h4 {
          color: #2c2c2c;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.5px;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .description-text {
          color: #4a4a4a;
          line-height: 1.7;
          margin: 0;
          font-size: 0.95rem;
        }

        .nutrition-info {
          background: rgba(139, 149, 86, 0.08);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #B8D4B8;
        }

        .nutrition-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .nutrition-header h4 {
          color: #2c2c2c;
          margin: 0;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.5px;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .serving-badge {
          background: rgba(122, 132, 73, 0.2);
          color: #7A8449;
          padding: 0.35rem 0.85rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid #7A8449;
          font-family: 'Segoe UI', 'Georgia', serif;
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
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          border-radius: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid #EBE5DE;
        }

        .nutrition-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(139, 149, 86, 0.15);
        }

        .nutrition-item.calories .nutrition-icon {
          color: #C47F6B;
          background: rgba(196, 127, 107, 0.15);
        }

        .nutrition-item.protein .nutrition-icon {
          color: #6B8FCE;
          background: rgba(107, 143, 206, 0.15);
        }

        .nutrition-item.fat .nutrition-icon {
          color: #C4963A;
          background: rgba(196, 150, 58, 0.15);
        }

        .nutrition-item.carbs .nutrition-icon {
          color: #7A8449;
          background: rgba(122, 132, 73, 0.15);
        }

        .nutrition-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .nutrition-value {
          display: flex;
          flex-direction: column;
        }

        .nutrition-value .value {
          font-size: 1.35rem;
          font-weight: 600;
          color: #2c2c2c;
          line-height: 1.2;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .nutrition-value .label {
          font-size: 0.85rem;
          color: #6B5D4F;
        }

        .nutrition-value .unit {
          font-size: 0.7rem;
          color: #8B9556;
        }

        .nutrition-note {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #B8D4B8;
          color: #6B5D4F;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Segoe UI', 'Georgia', serif;
          font-style: italic;
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
            letter-spacing: 1px;
          }

          .result-content {
            padding: 1rem;
          }

          .top-prediction h3 {
            font-size: 1.25rem;
            letter-spacing: 1px;
          }

          .detail-grid,
          .nutrition-grid {
            grid-template-columns: 1fr;
          }

          .description-info,
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
