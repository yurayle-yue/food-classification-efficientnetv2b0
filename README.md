# Klasifikasi Citra Makanan CNN - EfficientNetV2B0

**Judul Skripsi:** Implementasi Convolutional Neural Network (EfficientNetV2B0) untuk Klasifikasi Citra Makanan dan Informasi Gizi Berbasis Web

---

## 📊 Informasi Model

| Property | Value |
|----------|-------|
| **Arsitektur** | EfficientNetV2B0 |
| **Dataset** | Food-101 |
| **Jumlah Kelas** | 101 jenis makanan |
| **Input Size** | 224 x 224 pixel |
| **Akurasi** | **94.8%** |

### Environment Training

```
✅ Python Version      : 3.12.12
✅ TensorFlow          : 2.19.0
✅ Keras (Native)      : 3.10.0
✅ TF-Keras (Legacy)   : 2.19.0
✅ TensorFlow.js Conv. : 4.22.0
```

---

## 🎯 Arsitektur Aplikasi

**Single-App Architecture dengan TensorFlow.js (Browser-based)**

```
Website/
├── src/                      # Source code React
│   ├── App.jsx               # Main UI component
│   ├── App.css              # Styling
│   ├── index.js             # Entry point
│   ├── index.css            # Global styles
│   ├── components/          # React components
│   │   ├── ImageUploader.jsx
│   │   ├── ResultCard.jsx
│   │   └── LoadingSpinner.jsx
│   └── services/
│       └── tfjsService.js   # TensorFlow.js service
│
├── public/                  # Static files
│   ├── index.html          # HTML template
│   └── models/             # Model TensorFlow.js
│       ├── model.json      # Model architecture
│       ├── classes.json    # 101 label kelas
│       ├── nutrition.json  # Database gizi
│       └── group1-shard*.bin  # Model weights
│
├── package.json            # Dependencies
└── README.md               # File ini
```

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Aplikasi

```bash
npm start
```

Aplikasi akan berjalan di **http://localhost:3000**

### 3. Upload dan Klasifikasi

1. Klik area upload atau seret gambar makanan
2. Klik "Klasifikasikan"
3. Hasil prediksi dan informasi gizi akan muncul

---

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| **Klasifikasi Makanan** | Menggunakan EfficientNetV2B0 dengan 101 kelas |
| **Akurasi Tinggi** | 94.8% accuracy pada Food-101 dataset |
| **TensorFlow.js** | Model berjalan langsung di browser |
| **Informasi Gizi** | Kalori, protein, lemak, karbohidrat |
| **Top-5 Predictions** | 5 prediksi teratas dengan confidence |
| **Indikator Kepercayaan** | Visualisasi tingkat confidence prediksi |
| **Responsive** | Desktop & mobile friendly |
| **Drag & Drop** | Upload gambar mudah |
| **Real-time** | Prediksi instan tanpa server |

---

## 🛠️ Teknologi

### Frontend
- **React 18** - UI Framework
- **TensorFlow.js 4.22** - Deep Learning di Browser
- **CSS3** - Modern styling dengan gradient dan animasi

### Model
- **Arsitektur:** EfficientNetV2B0
- **Dataset:** Food-101 (101 kelas)
- **Input:** 224x224 RGB
- **Output:** 101 class probabilities
- **Akurasi:** 94.8%

---

## 📁 File Model

File yang diperlukan di `public/models/`:

- ✅ `model.json` - Model architecture
- ✅ `classes.json` - 101 label kelas
- ✅ `nutrition.json` - Database gizi
- ✅ `group1-shard*.bin` - Model weights

---

## 🎨 Tampilan Aplikasi

### Header
- Icon aplikasi dengan gradient background
- Judul dan subtitle informatif
- Badge: EfficientNetV2B0, Akurasi 94.8%, Food-101, 101 Kelas

### Halaman Upload
- Area drag & drop yang modern
- Tombol kamera untuk mobile
- Status loading dengan animasi

### Halaman Hasil
- **Gambar Input** dengan overlay label
- **Detail Model** - Arsitektur, Akurasi, Dataset, Jumlah Kelas
- **Prediksi #1** dengan badge confidence
- **Indikator Kepercayaan** - Tinggi (≥80%), Sedang (50-79%), Rendah (<50%)
- **Informasi Nilai Gizi** - Kalori, Protein, Lemak, Karbohidrat dengan icon berwarna
- **Prediksi Lainnya** - Progress bar untuk prediksi #2-#4

---

## 🔧 Troubleshooting

### "Gagal memuat model"

**Solusi:**
1. Pastikan `public/models/` berisi semua file
2. Cek browser console (F12)
3. Disable Ad Blocker sementara

### Performance lambat

**Solusi:**
1. Gunakan browser modern (Chrome, Firefox, Edge)
2. Tutup tab lain untuk free up memory
3. Pastikan GPU acceleration aktif
4. Gunakan hardware dengan GPU yang mendukung WebGL

### "Unknown operation" error

**Solusi:**
Pastikan model sudah di-convert dengan benar menggunakan tensorflowjs_converter:
```bash
tensorflowjs_converter --input_format=tf_saved_model \
  --output_format=tfjs_graph_model \
  --signature_name=serving_default \
  --saved_model_tags=serve \
  path/to/saved_model \
  public/models/
```

---

## 💡 Keunggulan Arsitektur Ini

1. ✅ **Client-side** - Tidak perlu server backend
2. ✅ **Real-time** - Instan tanpa network latency
3. ✅ **Privacy** - Gambar tidak dikirim ke server
4. ✅ **Scalable** - Processing di device user
5. ✅ **Offline-ready** - Bisa jalan tanpa internet setelah load model
6. ✅ **Modern** - Teknologi web terbaru

---

## 📝 Catatan untuk Skripsi

### Implementasi EfficientNetV2B0 untuk Klasifikasi Citra Makanan

**Poin penting:**
1. **Algoritma:** EfficientNetV2B0 (Modern CNN yang efisien)
2. **Dataset:** Food-101 (101 kelas, 101K gambar)
3. **Platform:** Web Browser (Client-side)
4. **Framework:** TensorFlow.js 4.22.0
5. **Preprocessing:** Resize 224x224, normalize [0,1]
6. **Output:** Top-5 predictions + nutrition info
7. **Akurasi:** 94.8%

### Arsitektur Sistem

```
User → Upload → React App → TensorFlow.js → Prediction → Result + Nutrition
                              ↓
                        EfficientNetV2B0 (browser)
                        model.json + weights
```

### EfficientNetV2B0

EfficientNetV2 adalah arsitektur CNN modern yang lebih cepat dan lebih akurat dibandingkan versi sebelumnya. Keunggulan:
- **Faster training** - Fused-MBConv untuk training yang lebih cepat
- **Better accuracy** - Progressive learning untuk akurasi yang lebih baik
- **Smaller model** - Parameter lebih efisien
- **Mobile-friendly** - Cocok untuk deployment di perangkat mobile

---

## 📚 Referensi

- [TensorFlow.js Docs](https://www.tensorflow.org/js)
- [EfficientNetV2 Paper](https://arxiv.org/abs/2104.00298)
- [Food-101 Dataset](https://www.kaggle.com/datasets/dansbecker/food-101)
- [React Docs](https://react.dev)

---

## 🎯 Quick Start

### Local Development

1. **Install:** `npm install`
2. **Start:** `npm start`
3. **Buka:** http://localhost:3000
4. **Upload gambar makanan dan lihat hasilnya!**

---

## 🌐 Deploy ke Vercel

### Cara Deploy

#### Option 1: Melalui Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy ke Vercel
vercel
```

#### Option 2: Melalui Vercel Dashboard

1. Push code ke GitHub/GitLab/Bitbucket
2. Buka [vercel.com](https://vercel.com)
3. Klik "Import Project"
4. Pilih repository
5. Vercel akan otomatis mendeteksi konfigurasi

### ⚠️ Penting: File Model Harus Ada

Sebelum deploy, pastikan folder `public/models/` berisi semua file:

```
public/models/
├── model.json           ← WAJIB
├── classes.json         ← WAJIB
├── nutrition.json       ← WAJIB
├── group1-shard1of3.bin ← WAJIB
├── group1-shard2of3.bin ← WAJIB
└── group1-shard3of3.bin ← WAJIB
```

### Konfigurasi Vercel

File `vercel.json` sudah disertakan dengan konfigurasi:
- Cache untuk model files (1 tahun)
- COOP/COEP headers untuk TensorFlow.js
- SPA routing untuk React

### Setelah Deploy

Aplikasi akan dapat diakses di:
- `https://your-project.vercel.app`

---

## 📄 License

**© 2025 - Skripsi: Implementasi CNN untuk Klasifikasi Citra Makanan**

**Tech Stack:** React 18 + TensorFlow.js 4.22 + EfficientNetV2B0 + Food-101
