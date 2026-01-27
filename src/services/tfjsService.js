import * as tf from '@tensorflow/tfjs';

// Set backend ke WebGL
tf.setBackend('webgl').then(() => {
  console.log('TensorFlow.js backend:', tf.getBackend());
});

/**
 * TensorFlow.js Service untuk Klasifikasi Citra Makanan
 * Menggunakan model EfficientNetV2B0 yang sudah dilatih dengan dataset Food-101
 */
class TFJSService {
  constructor() {
    this.model = null;
    this.classes = [];
    this.nutritionData = {};
    this.isModelLoaded = false;
    this.isLoading = false;
    this.modelInfo = {
      name: 'EfficientNetV2B0',
      architecture: 'EfficientNet V2 B0',
      accuracy: '94.8%',
      dataset: 'Food-101',
      inputSize: 224,
      numClasses: 101
    };
  }

  /**
   * Memuat model CNN dan data pendukung
   */
  async loadModel() {
    if (this.isModelLoaded || this.isLoading) {
      return this.model;
    }

    this.isLoading = true;

    try {
      // Load model EfficientNetV2B0 (Graph Model format)
      const modelUrl = '/models/model.json';
      console.log('🔄 Loading model from:', modelUrl);

      this.model = await tf.loadGraphModel(modelUrl);
      console.log('✅ Model loaded successfully!');
      console.log('📥 Model inputs:', this.model.inputNodes);
      console.log('📤 Model outputs:', this.model.outputNodes);

      // Load classes, nutrition data, dan descriptions
      const [classesResponse, nutritionResponse, descriptionsResponse] = await Promise.all([
        fetch('/models/classes.json'),
        fetch('/models/nutrition.json'),
        fetch('/models/descriptions.json')
      ]);

      this.classes = await classesResponse.json();
      this.nutritionData = await nutritionResponse.json();
      this.descriptionData = await descriptionsResponse.json();

      this.isModelLoaded = true;
      this.isLoading = false;

      console.log(`✅ Classes loaded: ${this.classes.length} classes`);
      console.log(`✅ Nutrition data loaded: ${Object.keys(this.nutritionData).length} items`);
      console.log(`✅ Descriptions loaded: ${Object.keys(this.descriptionData).length} items`);

      return this.model;
    } catch (error) {
      this.isLoading = false;
      console.error('❌ Error loading model:', error);
      throw new Error(`Gagal memuat model: ${error.message}`);
    }
  }

  /**
   * Preprocess gambar sebelum diprediksi
   * SESUAI COLAB: image_dataset_from_directory scale ke [0, 1]
   * dan tf.keras.utils.img_to_array() return [0, 255] lalu model accept itu
   */
  preprocessImage(imageElement) {
    return tf.tidy(() => {
      // Convert image ke tensor (RGB) - returns [0, 255]
      const tensor = tf.browser.fromPixels(imageElement);

      // Resize ke 224x224
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);

      // NORMAL: cast ke float32 dan range [0, 255] (sesuai img_to_array)
      // Lalu model akan handle preprocessing-nya sendiri
      const floatImg = resized.toFloat();

      // Add batch dimension
      const batched = floatImg.expandDims(0);

      return batched;
    });
  }

  /**
   * Melakukan prediksi klasifikasi makanan
   */
  async predict(imageElement) {
    if (!this.isModelLoaded) {
      await this.loadModel();
    }

    try {
      // Preprocess gambar
      const preprocessed = this.preprocessImage(imageElement);
      console.log('📸 Preprocessed shape:', preprocessed.shape);
      console.log('📸 Preprocessed min/max:', await preprocessed.min().data(), await preprocessed.max().data());

      // Coba beberapa cara untuk memanggil model
      let predictionTensor;
      let result;

      // Cara 1: Gunakan signature inputs/outputs (recommended)
      try {
        result = this.model.predict({ 'input_2': preprocessed });
        console.log('✅ Using signature predict with input_2');
      } catch (e) {
        console.log('⚠️ Signature predict failed, trying execute...');

        // Cara 2: Gunakan execute dengan input node
        const inputName = this.model.inputNodes[0];
        console.log('🔍 Using input node:', inputName);

        result = this.model.execute({ [inputName]: preprocessed });
      }

      console.log('📊 Execute result type:', typeof result);
      console.log('📊 Is tensor?', result instanceof tf.Tensor);

      // Handle output - bisa tensor atau object
      if (result instanceof tf.Tensor) {
        predictionTensor = result;
        console.log('✅ Result is a tensor');
      } else if (Array.isArray(result)) {
        predictionTensor = result[0];
        console.log('✅ Result is array, taking first element');
      } else if (typeof result === 'object' && result !== null) {
        // Cari tensor pertama dalam object
        console.log('🔍 Result is object, keys:', Object.keys(result));
        const values = Object.values(result);
        for (const val of values) {
          if (val instanceof tf.Tensor) {
            predictionTensor = val;
            console.log('✅ Found tensor in object');
            break;
          }
        }
      }

      if (!predictionTensor) {
        throw new Error('No valid tensor found in prediction result. Result type: ' + typeof result);
      }

      console.log('✅ Prediction tensor shape:', predictionTensor.shape);

      // Model di Colab punya activation='softmax' di layer terakhir
      // Jadi output SUDAH probabilities, TIDAK perlu softmax lagi!
      const probabilities = await predictionTensor.data();
      console.log('📈 Raw probabilities sample (first 5):', Array.from(probabilities).slice(0, 5));

      // Verify sum mendekati 1
      const sum = Array.from(probabilities).reduce((a, b) => a + b, 0);
      console.log('📊 Sum of probabilities (should be ~1.0):', sum.toFixed(4));

      console.log('📈 Top 5 Probabilities:', Array.from(probabilities)
        .map((p, i) => ({ idx: i, prob: p }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 5)
        .map(x => `${this.classes[x.idx] || 'class_' + x.idx}: ${(x.prob * 100).toFixed(2)}%`)
      );

      // Sort dan ambil top 5
      const topIndices = Array.from(probabilities)
        .map((prob, index) => ({ prob, index }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 5);

      console.log('🏆 Top predictions:', topIndices);

      // Format hasil
      const results = topIndices.map((item, rank) => {
        const className = this.classes[item.index];
        const confidence = (item.prob * 100).toFixed(2);
        const nutrition = this.nutritionData[className] || null;
        const description = this.descriptionData[className] || null;

        return {
          rank: rank + 1,
          className,
          displayName: this.formatClassName(className),
          confidence,
          nutrition,
          description
        };
      });

      console.log('✅ Final results:', results);

      // Cleanup tensors
      preprocessed.dispose();
      if (predictionTensor) {
        predictionTensor.dispose();
      }

      return results;
    } catch (error) {
      console.error('❌ Error during prediction:', error);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  /**
   * Format nama kelas menjadi lebih readable
   */
  formatClassName(className) {
    return className
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Check apakah model sudah diload
   */
  isReady() {
    return this.isModelLoaded;
  }

  /**
   * Mendapatkan informasi model
   */
  getModelInfo() {
    return this.modelInfo;
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelLoaded = false;
    }
  }
}

// Export singleton instance
const tfjsService = new TFJSService();
export default tfjsService;
