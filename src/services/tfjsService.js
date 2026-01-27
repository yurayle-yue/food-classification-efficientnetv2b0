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

      // Load classes dan nutrition data
      const [classesResponse, nutritionResponse] = await Promise.all([
        fetch('/models/classes.json'),
        fetch('/models/nutrition.json')
      ]);

      this.classes = await classesResponse.json();
      this.nutritionData = await nutritionResponse.json();

      this.isModelLoaded = true;
      this.isLoading = false;

      console.log(`✅ Classes loaded: ${this.classes.length} classes`);
      console.log(`✅ Nutrition data loaded: ${Object.keys(this.nutritionData).length} items`);

      return this.model;
    } catch (error) {
      this.isLoading = false;
      console.error('❌ Error loading model:', error);
      throw new Error(`Gagal memuat model: ${error.message}`);
    }
  }

  /**
   * Preprocess gambar sebelum diprediksi
   * Menggunakan preprocessing yang sesuai dengan EfficientNetV2
   */
  preprocessImage(imageElement) {
    return tf.tidy(() => {
      // Convert image ke tensor
      const tensor = tf.browser.fromPixels(imageElement);

      // Resize ke 224x224
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);

      // Normalisasi ke [-1, 1] untuk EfficientNetV2
      // (resized / 127.5) - 1.0
      const normalized = resized.div(127.5).sub(1.0);

      // Add batch dimension
      const batched = normalized.expandDims(0);

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

      // Prediksi menggunakan execute dengan input mapping
      const inputName = this.model.inputNodes[0];
      console.log('🔍 Using input node:', inputName);

      const result = this.model.execute({ [inputName]: preprocessed });
      console.log('📊 Execute result type:', typeof result);
      console.log('📊 Is tensor?', result instanceof tf.Tensor);

      // Handle output - bisa tensor atau object
      let predictionTensor;
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

      // Ambil probabilities
      const probabilities = await predictionTensor.data();
      console.log('📈 Probabilities sample:', Array.from(probabilities).slice(0, 5));

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

        return {
          rank: rank + 1,
          className,
          displayName: this.formatClassName(className),
          confidence,
          nutrition
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
