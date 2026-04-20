<div align="center">

# Klasifikasi Citra Makanan

### EfficientNetV2B0 + TensorFlow.js

Implementasi Convolutional Neural Network untuk Klasifikasi Citra Makanan dan Informasi Gizi Berbasis Web

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![Food-101](https://img.shields.io/badge/Dataset-Food--101-8B9556)](https://www.kaggle.com/datasets/dansbecker/food-101)
[![Accuracy](https://img.shields.io/badge/Akurasi-94.8%25-success)](/)
[![License](https://img.shields.io/badge/License-%C2%A9%202026%20Satria%20Tarigan-blue)](/)

---

**Skripsi** oleh **Satria Tarigan**

</div>

---

## Tentang Proyek

Aplikasi web yang mampu mengklasifikasikan **101 jenis makanan** secara real-time langsung di browser menggunakan deep learning. Model **EfficientNetV2B0** dilatih pada dataset **Food-101** dan mencapai akurasi **94.8%**. Selain prediksi, aplikasi juga menampilkan **informasi nilai gizi** (kalori, protein, lemak, karbohidrat) untuk setiap makanan yang terdeteksi.

Seluruh inferensi berjalan **client-side** menggunakan TensorFlow.js — tanpa server backend, tanpa mengirim data ke mana pun.

---

## Fitur Utama

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | **Klasifikasi 101 Kelas** | Mengenali 101 jenis makanan dari dataset Food-101 |
| 2 | **Informasi Gizi** | Kalori, protein, lemak, dan karbohidrat per 100g |
| 3 | **Top-5 Predictions** | 5 prediksi teratas beserta tingkat confidence |
| 4 | **Indikator Kepercayaan** | Visualisasi: Tinggi (>=80%), Sedang (50-79%), Rendah (<50%) |
| 5 | **Client-side Inference** | Prediksi langsung di browser via TensorFlow.js |
| 6 | **Drag & Drop Upload** | Upload gambar dengan mudah |
| 7 | **Preview Gambar** | Lihat gambar sebelum submit klasifikasi |
| 8 | **Responsive Design** | Optimal di desktop maupun mobile |
| 9 | **Daftar 101 Makanan** | Katalog lengkap dengan pencarian dan filter kategori |
| 10 | **Offline-ready** | Berjalan tanpa internet setelah model dimuat |

---

## 4 Fitur Pengujian Model

Aplikasi ini dilengkapi **4 fitur khusus** untuk membuktikan bahwa model AI benar-benar bekerja:

### 1. Riwayat Prediksi (History)

Semua prediksi yang pernah dilakukan tersimpan dalam tabel riwayat (maks 50 entri, disimpan di `localStorage`):

| Kolom | Keterangan |
|-------|------------|
| Gambar | Thumbnail gambar input |
| Prediksi | Nama makanan hasil prediksi |
| Confidence | Persentase keyakinan model |
| Waktu | Waktu inferensi (ms) |
| Aksi | Tombol hapus per entri |

Tersedia juga tombol **Hapus Semua** di header panel untuk membersihkan seluruh riwayat sekaligus (dengan konfirmasi), yang juga menghapus data di `localStorage`.

### 2. Benchmark / Speed Test

Setiap prediksi menampilkan **breakdown waktu** secara detail:

| Tahap | Keterangan |
|-------|------------|
| **Preprocess** | Waktu resize & normalisasi gambar (ms) |
| **Inferensi** | Waktu model memproses gambar (ms) |
| **Postprocess** | Waktu sorting & formatting hasil (ms) |
| **Total** | Total waktu keseluruhan (ms) |

Ini membuktikan model berjalan di browser, bukan di server.

### 3. Confidence Distribution Chart

Grafik batang interaktif yang menampilkan **probabilitas semua 101 kelas** untuk setiap prediksi:
- Collapsible (bisa di-expand/collapse)
- Menampilkan Top-10 secara default, bisa diperluas sampai 101
- Bar chart proporsional terhadap prediksi tertinggi
- Membuktikan model benar-benar menghitung probabilitas untuk semua kelas

### 4. Model Info & Debug Panel

Panel teknis yang menampilkan informasi internal:

| Info | Keterangan |
|------|------------|
| TF.js Backend | WebGL / WASM / CPU |
| TF.js Version | Versi TensorFlow.js |
| WebGL Support | Apakah GPU acceleration aktif |
| Active Tensors | Jumlah tensor di memori |
| Memory Usage | Penggunaan memori model |
| Input/Output Nodes | Node input/output model graph |
| Model Architecture | EfficientNetV2B0 |
| Input Size | 224 x 224 x 3 |

---

## Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| **UI Framework** | React | 18.3 |
| **Deep Learning** | TensorFlow.js | 4.22 |
| **Arsitektur CNN** | EfficientNetV2B0 | - |
| **Dataset** | Food-101 | 101 kelas, 101K gambar |
| **Styling** | CSS3 | Custom Farm-to-Table theme |
| **Deploy** | Vercel | - |

### Environment Training

```
Python          : 3.12.12
TensorFlow      : 2.19.0
Keras (Native)  : 3.10.0
TF-Keras        : 2.19.0
TensorFlow.js   : 4.22.0
```

---

## Quick Start

### Prasyarat

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Instalasi & Menjalankan

```bash
# Clone repository
git clone https://github.com/yurayle-yue/EfficientNetV2B0.git
cd EfficientNetV2B0

# Install dependencies
npm install

# Jalankan development server
npm start
```

Aplikasi akan berjalan di **http://localhost:3000**

### Cara Penggunaan

1. Upload gambar makanan lewat drag & drop atau klik area upload
2. Klik **"Submit untuk Klasifikasi"**
3. Lihat hasil prediksi, informasi gizi, benchmark, dan confidence chart
4. Lihat riwayat prediksi di panel History
5. Hapus entri per baris dengan tombol trash, atau kosongkan seluruh riwayat via **Hapus Semua**

---

## Struktur Proyek

```
EfficientNetV2B0/
├── public/
│   ├── index.html                  # HTML template dengan preloader
│   └── models/                     # Model TensorFlow.js
│       ├── model.json              # Arsitektur model
│       ├── classes.json            # 101 label kelas
│       ├── nutrition.json          # Database informasi gizi
│       ├── descriptions.json       # Deskripsi makanan
│       └── group1-shard[1-3]of3.bin  # Model weights (~3 shards)
│
├── src/
│   ├── App.jsx                     # Komponen utama + state management
│   ├── App.css                     # Styling + responsive breakpoints
│   ├── index.js                    # Entry point React
│   ├── index.css                   # Global styles
│   ├── components/
│   │   ├── ImageUploader.jsx       # [Fitur] Upload dengan drag & drop
│   │   ├── ResultCard.jsx          # [Fitur] Hasil prediksi + benchmark
│   │   ├── FoodList.jsx            # [Fitur] Katalog 101 makanan (searchable)
│   │   ├── ConfidenceChart.jsx     # [Fitur 3] Distribusi confidence chart
│   │   ├── PredictionHistory.jsx   # [Fitur 1] Riwayat prediksi
│   │   ├── DebugPanel.jsx          # [Fitur 4] Model info & debug
│   │   └── LoadingSpinner.jsx      # Loading animation
│   └── services/
│       └── tfjsService.js          # [Fitur 2] TF.js service + benchmark
│
├── package.json
├── vercel.json                     # Konfigurasi deploy Vercel
└── start.bat                       # Script untuk menjalankan di Windows
```

---

## Arsitektur Sistem

```
                    ┌───────────────────────────────────────────┐
                    │              Browser (Client)              │
                    │                                           │
  Upload        ──> │  React App                                │
                    │    │                                      │
                    │    ├── Preprocessing (resize 224x224)     │
                    │    │         Benchmark: ⏱ preprocess      │
                    │    │                                      │
                    │    ├── TensorFlow.js (WebGL)              │
                    │    │     └── EfficientNetV2B0             │
                    │    │         Benchmark: ⏱ inference       │
                    │    │                                      │
                    │    ├── Top-5 Predictions                  │
                    │    ├── Confidence Distribution (101 kelas)│
                    │    ├── Informasi Gizi (nutrition.json)    │
                    │    └── History (localStorage)             │
                    │                                           │
                    └───────────────────────────────────────────┘
                              Tidak ada server backend
```

---

## Model EfficientNetV2B0

EfficientNetV2B0 adalah arsitektur CNN generasi terbaru dari Google yang menggunakan **Fused-MBConv** dan **progressive learning** untuk training yang lebih cepat dan akurat.

| Properti | Detail |
|----------|--------|
| **Arsitektur** | EfficientNetV2B0 |
| **Input Size** | 224 x 224 x 3 (RGB) |
| **Output** | 101 class probabilities (softmax) |
| **Dataset** | Food-101 (101 kelas, 101.000 gambar) |
| **Akurasi** | **94.8%** |
| **Preprocessing** | Resize + Normalize [0, 1] |

### Keunggulan EfficientNetV2B0

- **Faster training** — Fused-MBConv mengurangi overhead training
- **Better accuracy** — Progressive learning meningkatkan akurasi
- **Smaller model** — Parameter lebih efisien dibanding EfficientNet v1
- **Mobile-friendly** — Cocok untuk deployment di browser dan perangkat mobile

> **Paper:** [EfficientNetV2: Smaller Models and Faster Training](https://arxiv.org/abs/2104.00298)

---

## Daftar 101 Jenis Makanan (Food-101)

Berikut adalah daftar lengkap makanan yang dapat dikenali oleh model. Pastikan gambar yang di-upload termasuk dalam salah satu kategori ini.

<details>
<summary><b>Daging & Seafood (21)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Baby Back Ribs | 12 | Mussels |
| 2 | Beef Carpaccio | 13 | Oysters |
| 3 | Beef Tartare | 14 | Peking Duck |
| 4 | Chicken Curry | 15 | Pork Chop |
| 5 | Chicken Wings | 16 | Prime Rib |
| 6 | Crab Cakes | 17 | Pulled Pork Sandwich |
| 7 | Filet Mignon | 18 | Scallops |
| 8 | Foie Gras | 19 | Shrimp And Grits |
| 9 | Grilled Salmon | 20 | Steak |
| 10 | Lobster Bisque | 21 | Tuna Tartare |
| 11 | Lobster Roll Sandwich | | |

</details>

<details>
<summary><b>Pasta & Nasi (12)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Fried Rice | 7 | Ramen |
| 2 | Gnocchi | 8 | Ravioli |
| 3 | Lasagna | 9 | Risotto |
| 4 | Macaroni And Cheese | 10 | Spaghetti Bolognese |
| 5 | Pad Thai | 11 | Spaghetti Carbonara |
| 6 | Paella | 12 | Pho |

</details>

<details>
<summary><b>Sandwich & Burger (8)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Breakfast Burrito | 5 | Hot Dog |
| 2 | Club Sandwich | 6 | Chicken Quesadilla |
| 3 | Grilled Cheese Sandwich | 7 | Croque Madame |
| 4 | Hamburger | 8 | Tacos |

</details>

<details>
<summary><b>Salad & Sayuran (8)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Beet Salad | 5 | Greek Salad |
| 2 | Caesar Salad | 6 | Guacamole |
| 3 | Caprese Salad | 7 | Hummus |
| 4 | Edamame | 8 | Seaweed Salad |

</details>

<details>
<summary><b>Sup & Kuah (4)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Clam Chowder | 3 | Hot And Sour Soup |
| 2 | French Onion Soup | 4 | Miso Soup |

</details>

<details>
<summary><b>Makanan Ringan & Goreng (19)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Bruschetta | 11 | Nachos |
| 2 | Churros | 12 | Onion Rings |
| 3 | Deviled Eggs | 13 | Pancakes |
| 4 | Dumplings | 14 | Samosa |
| 5 | Escargots | 15 | Spring Rolls |
| 6 | Falafel | 16 | Takoyaki |
| 7 | Fish And Chips | 17 | Waffles |
| 8 | French Fries | 18 | French Toast |
| 9 | Fried Calamari | 19 | Garlic Bread |
| 10 | Gyoza | | |

</details>

<details>
<summary><b>Sushi & Jepang (3)</b></summary>

| No | Nama |
|----|------|
| 1 | Bibimbap |
| 2 | Sashimi |
| 3 | Sushi |

</details>

<details>
<summary><b>Kue & Dessert (18)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Apple Pie | 10 | Frozen Yogurt |
| 2 | Baklava | 11 | Ice Cream |
| 3 | Bread Pudding | 12 | Macarons |
| 4 | Cannoli | 13 | Panna Cotta |
| 5 | Carrot Cake | 14 | Red Velvet Cake |
| 6 | Cheesecake | 15 | Strawberry Shortcake |
| 7 | Chocolate Cake | 16 | Tiramisu |
| 8 | Chocolate Mousse | 17 | Cup Cakes |
| 9 | Creme Brulee | 18 | Donuts |

</details>

<details>
<summary><b>Lainnya (8)</b></summary>

| No | Nama | No | Nama |
|----|------|----|------|
| 1 | Beignets | 5 | Huevos Rancheros |
| 2 | Ceviche | 6 | Omelette |
| 3 | Cheese Plate | 7 | Pizza |
| 4 | Eggs Benedict | 8 | Poutine |

</details>

---

## Tema Farm-to-Table

Aplikasi menggunakan tema **Farm-to-Table** dengan nuansa organic, fresh, dan natural.

| Warna | Hex | Penggunaan |
|-------|-----|------------|
| Olive Green | `#8B9556` | Primary buttons, accents |
| Sage Green | `#9CAF88` | Secondary elements |
| Earth Brown | `#A67B5B` | Secondary buttons |
| Warm Cream | `#FAF7F2` | Background |
| Light Beige | `#EBE5DE` | Borders, dividers |
| Terracotta | `#C47F6B` | Error states |

---

## Deploy ke Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard

1. Push code ke GitHub
2. Buka [vercel.com](https://vercel.com) dan klik **Import Project**
3. Pilih repository — Vercel otomatis mendeteksi konfigurasi

### File Model (Wajib Ada)

Pastikan `public/models/` berisi semua file sebelum deploy:

```
public/models/
├── model.json              # Wajib
├── classes.json            # Wajib
├── nutrition.json          # Wajib
├── descriptions.json       # Wajib
├── group1-shard1of3.bin    # Wajib
├── group1-shard2of3.bin    # Wajib
└── group1-shard3of3.bin    # Wajib
```

File `vercel.json` sudah dikonfigurasi dengan cache untuk model files, COOP/COEP headers untuk TensorFlow.js, dan SPA routing.

---

## Troubleshooting

<details>
<summary><b>Performa lambat saat inferensi</b></summary>

- Gunakan browser modern (Chrome / Edge / Firefox)
- Tutup tab yang tidak diperlukan untuk membebaskan memori
- Pastikan **GPU acceleration** aktif di pengaturan browser
- Cek Debug Panel — pastikan backend adalah **webgl**, bukan **cpu**
- Perangkat dengan GPU yang mendukung WebGL akan jauh lebih cepat

</details>

<details>
<summary><b>Error "Unknown operation"</b></summary>

Model perlu di-convert ulang dengan tensorflowjs_converter:

```bash
tensorflowjs_converter \
  --input_format=tf_saved_model \
  --output_format=tfjs_graph_model \
  --signature_name=serving_default \
  --saved_model_tags=serve \
  path/to/saved_model \
  public/models/
```

</details>

<details>
<summary><b>History / Riwayat hilang</b></summary>

Riwayat prediksi disimpan di `localStorage` browser. Data bisa hilang jika:
- Browser di-clear cache/cookies
- Menggunakan mode Incognito/Private
- `localStorage` penuh (maks 50 entri disimpan)
- User menekan tombol **Hapus Semua** atau tombol hapus per entri di panel History

</details>

---

## Keunggulan

| No | Aspek | Keterangan |
|----|-------|------------|
| 1 | **Client-side** | Tidak memerlukan server backend |
| 2 | **Real-time** | Prediksi instan tanpa network latency |
| 3 | **Privacy** | Gambar tidak dikirim ke server manapun |
| 4 | **Scalable** | Processing di device masing-masing user |
| 5 | **Offline-ready** | Berjalan tanpa internet setelah model dimuat |
| 6 | **Testable** | 4 fitur pengujian membuktikan model bekerja |
| 7 | **Transparent** | Benchmark, debug info, dan confidence chart |

---

## Referensi

- [EfficientNetV2: Smaller Models and Faster Training](https://arxiv.org/abs/2104.00298) — Paper asli
- [TensorFlow.js Documentation](https://www.tensorflow.org/js) — Framework inferensi
- [Food-101 Dataset](https://www.kaggle.com/datasets/dansbecker/food-101) — Dataset training
- [React Documentation](https://react.dev) — UI framework

---

<div align="center">

**&copy; 2026 Satria Tarigan**

Skripsi: Implementasi CNN (EfficientNetV2B0) untuk Klasifikasi Citra Makanan dan Informasi Gizi Berbasis Web

`React 18` &middot; `TensorFlow.js 4.22` &middot; `EfficientNetV2B0` &middot; `Food-101`

</div>
