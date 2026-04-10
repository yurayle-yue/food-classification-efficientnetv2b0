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
    this.descriptionData = {};
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
      const modelUrl = '/models/model.json';
      console.log('Loading model from:', modelUrl);

      this.model = await tf.loadGraphModel(modelUrl);
      console.log('Model loaded successfully!');

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

      console.log(`Classes loaded: ${this.classes.length} classes`);
      console.log(`Nutrition data loaded: ${Object.keys(this.nutritionData).length} items`);
      console.log(`Descriptions loaded: ${Object.keys(this.descriptionData).length} items`);

      return this.model;
    } catch (error) {
      this.isLoading = false;
      console.error('Error loading model:', error);
      throw new Error(`Gagal memuat model: ${error.message}`);
    }
  }

  /**
   * Preprocess gambar sebelum diprediksi
   */
  preprocessImage(imageElement) {
    return tf.tidy(() => {
      const tensor = tf.browser.fromPixels(imageElement);
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);
      const floatImg = resized.toFloat();
      const batched = floatImg.expandDims(0);
      return batched;
    });
  }

  /**
   * Melakukan prediksi klasifikasi makanan
   * Returns: { predictions, benchmark, allProbabilities }
   */
  async predict(imageElement) {
    if (!this.isModelLoaded) {
      await this.loadModel();
    }

    const benchmark = {
      preprocessTime: 0,
      inferenceTime: 0,
      postprocessTime: 0,
      totalTime: 0
    };

    const totalStart = performance.now();

    try {
      // Preprocess
      const preprocessStart = performance.now();
      const preprocessed = this.preprocessImage(imageElement);
      benchmark.preprocessTime = Math.round(performance.now() - preprocessStart);

      // Inference
      const inferenceStart = performance.now();
      let result;
      try {
        result = this.model.predict({ 'input_2': preprocessed });
      } catch (e) {
        const inputName = this.model.inputNodes[0];
        result = this.model.execute({ [inputName]: preprocessed });
      }
      benchmark.inferenceTime = Math.round(performance.now() - inferenceStart);

      // Postprocess
      const postprocessStart = performance.now();

      let predictionTensor;
      if (result instanceof tf.Tensor) {
        predictionTensor = result;
      } else if (Array.isArray(result)) {
        predictionTensor = result[0];
      } else if (typeof result === 'object' && result !== null) {
        const values = Object.values(result);
        for (const val of values) {
          if (val instanceof tf.Tensor) {
            predictionTensor = val;
            break;
          }
        }
      }

      if (!predictionTensor) {
        throw new Error('No valid tensor found in prediction result.');
      }

      const probabilities = await predictionTensor.data();

      // All probabilities for chart
      const allProbabilities = Array.from(probabilities).map((prob, index) => ({
        className: this.classes[index],
        displayName: this.formatClassName(this.classes[index]),
        probability: prob,
        percentage: (prob * 100).toFixed(4)
      })).sort((a, b) => b.probability - a.probability);

      // Top 5
      const topIndices = Array.from(probabilities)
        .map((prob, index) => ({ prob, index }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 5);

      const predictions = topIndices.map((item, rank) => {
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

      benchmark.postprocessTime = Math.round(performance.now() - postprocessStart);
      benchmark.totalTime = Math.round(performance.now() - totalStart);

      // Cleanup tensors
      preprocessed.dispose();
      if (predictionTensor) predictionTensor.dispose();

      return {
        predictions,
        benchmark,
        allProbabilities
      };
    } catch (error) {
      console.error('Error during prediction:', error);
      throw error;
    }
  }

  /**
   * Format nama kelas menjadi lebih readable
   */
  formatClassName(className) {
    if (!className) return '';
    return className
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get all class names
   */
  getClasses() {
    return this.classes;
  }

  /**
   * Get debug/technical info about the model and TF.js
   */
  getDebugInfo() {
    const memInfo = tf.memory();
    return {
      backend: tf.getBackend(),
      tfVersion: tf.version.tfjs,
      numTensors: memInfo.numTensors,
      numBytes: memInfo.numBytes,
      numBytesFormatted: this.formatBytes(memInfo.numBytes),
      unreliable: memInfo.unreliable,
      modelLoaded: this.isModelLoaded,
      inputNodes: this.model?.inputNodes || [],
      outputNodes: this.model?.outputNodes || [],
      numClasses: this.classes.length,
      inputSize: '224 x 224 x 3',
      modelArchitecture: 'EfficientNetV2B0',
      dataset: 'Food-101',
      webglSupport: !!document.createElement('canvas').getContext('webgl2') || !!document.createElement('canvas').getContext('webgl')
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isReady() {
    return this.isModelLoaded;
  }

  getModelInfo() {
    return this.modelInfo;
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelLoaded = false;
    }
  }
}

const tfjsService = new TFJSService();
export default tfjsService;
