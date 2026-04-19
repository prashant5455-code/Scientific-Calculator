const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const math = require('mathjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Configure mathjs for higher precision
math.config({
  number: 'BigNumber',
  precision: 64
});

// Cache for expensive calculations
const calculationCache = new Map();
const CACHE_SIZE = 1000;

// Cache management
function getCacheKey(operation, params) {
  return `${operation}_${JSON.stringify(params)}`;
}

function setCache(key, result) {
  if (calculationCache.size >= CACHE_SIZE) {
    const firstKey = calculationCache.keys().next().value;
    calculationCache.delete(firstKey);
  }
  calculationCache.set(key, result);
}

function getCache(key) {
  return calculationCache.get(key);
}

// Utility functions
function validateMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) return false;
  const rowLength = matrix[0].length;
  return matrix.every(row => Array.isArray(row) && row.length === rowLength && row.every(val => typeof val === 'number'));
}

function validateComplex(complex) {
  return typeof complex === 'object' && typeof complex.re === 'number' && typeof complex.im === 'number';
}

function validateFunction(funcStr) {
  try {
    // Test evaluation with sample values
    const testX = 1;
    const expression = funcStr.replace(/x/g, testX);
    math.evaluate(expression);
    return true;
  } catch (error) {
    return false;
  }
}

// API Routes

// Basic calculation
app.post('/api/calculate', (req, res) => {
  try {
    const { expression, angleMode = 'deg' } = req.body;

    if (!expression || typeof expression !== 'string') {
      return res.status(400).json({ error: 'Invalid expression' });
    }

    // Process trigonometric functions based on angle mode
    let processedExpression = expression;
    if (angleMode === 'deg') {
      processedExpression = processedExpression.replace(/sin\(/g, 'sin(deg(');
      processedExpression = processedExpression.replace(/cos\(/g, 'cos(deg(');
      processedExpression = processedExpression.replace(/tan\(/g, 'tan(deg(');
    }

    const result = math.evaluate(processedExpression);
    res.json({ result: result.toString() });
  } catch (error) {
    res.status(400).json({ error: 'Calculation error: ' + error.message });
  }
});

// Matrix operations
app.post('/api/matrix/operation', (req, res) => {
  try {
    const { operation, matrixA, matrixB } = req.body;

    if (!validateMatrix(matrixA)) {
      return res.status(400).json({ error: 'Invalid matrix A' });
    }

    let result;
    const matA = math.matrix(matrixA);

    switch (operation) {
      case 'add':
        if (!validateMatrix(matrixB)) return res.status(400).json({ error: 'Invalid matrix B' });
        result = math.add(matA, math.matrix(matrixB));
        break;
      case 'subtract':
        if (!validateMatrix(matrixB)) return res.status(400).json({ error: 'Invalid matrix B' });
        result = math.subtract(matA, math.matrix(matrixB));
        break;
      case 'multiply':
        if (!validateMatrix(matrixB)) return res.status(400).json({ error: 'Invalid matrix B' });
        result = math.multiply(matA, math.matrix(matrixB));
        break;
      case 'determinant':
        result = math.det(matA);
        break;
      case 'inverse':
        result = math.inv(matA);
        break;
      case 'transpose':
        result = math.transpose(matA);
        break;
      case 'eigenvalues':
        result = math.eigs(matA).values;
        break;
      case 'eigenvectors':
        result = math.eigs(matA).vectors;
        break;
      case 'rank':
        result = math.rank(matA);
        break;
      case 'trace':
        result = math.trace(matA);
        break;
      default:
        return res.status(400).json({ error: 'Unknown matrix operation' });
    }

    res.json({ result: result._data || result });
  } catch (error) {
    res.status(400).json({ error: 'Matrix operation error: ' + error.message });
  }
});

// Complex number operations
app.post('/api/complex/operation', (req, res) => {
  try {
    const { operation, complexA, complexB } = req.body;

    if (!validateComplex(complexA)) {
      return res.status(400).json({ error: 'Invalid complex number A' });
    }

    let result;
    const compA = math.complex(complexA.re, complexA.im);

    switch (operation) {
      case 'add':
        if (!validateComplex(complexB)) return res.status(400).json({ error: 'Invalid complex number B' });
        result = math.add(compA, math.complex(complexB.re, complexB.im));
        break;
      case 'subtract':
        if (!validateComplex(complexB)) return res.status(400).json({ error: 'Invalid complex number B' });
        result = math.subtract(compA, math.complex(complexB.re, complexB.im));
        break;
      case 'multiply':
        if (!validateComplex(complexB)) return res.status(400).json({ error: 'Invalid complex number B' });
        result = math.multiply(compA, math.complex(complexB.re, complexB.im));
        break;
      case 'divide':
        if (!validateComplex(complexB)) return res.status(400).json({ error: 'Invalid complex number B' });
        result = math.divide(compA, math.complex(complexB.re, complexB.im));
        break;
      case 'conjugate':
        result = math.conj(compA);
        break;
      case 'magnitude':
        result = math.abs(compA);
        break;
      case 'argument':
        result = math.arg(compA);
        break;
      case 'sqrt':
        result = math.sqrt(compA);
        break;
      case 'exp':
        result = math.exp(compA);
        break;
      case 'log':
        result = math.log(compA);
        break;
      case 'sin':
        result = math.sin(compA);
        break;
      case 'cos':
        result = math.cos(compA);
        break;
      case 'tan':
        result = math.tan(compA);
        break;
      default:
        return res.status(400).json({ error: 'Unknown complex operation' });
    }

    res.json({ result: { re: result.re, im: result.im } });
  } catch (error) {
    res.status(400).json({ error: 'Complex operation error: ' + error.message });
  }
});

// Statistics operations
app.post('/api/statistics', (req, res) => {
  try {
    const { operation, data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Invalid data array' });
    }

    const numericData = data.map(x => parseFloat(x)).filter(x => !isNaN(x));
    if (numericData.length === 0) {
      return res.status(400).json({ error: 'No valid numeric data' });
    }

    let result;
    switch (operation) {
      case 'mean':
        result = math.mean(numericData);
        break;
      case 'median':
        result = math.median(numericData);
        break;
      case 'mode':
        result = math.mode(numericData);
        break;
      case 'std':
        result = math.std(numericData);
        break;
      case 'variance':
        result = math.variance(numericData);
        break;
      case 'min':
        result = math.min(numericData);
        break;
      case 'max':
        result = math.max(numericData);
        break;
      case 'range':
        result = math.max(numericData) - math.min(numericData);
        break;
      case 'sum':
        result = math.sum(numericData);
        break;
      case 'product':
        result = math.prod(numericData);
        break;
      case 'quantile':
        result = math.quantileSeq(numericData, [0.25, 0.5, 0.75]);
        break;
      default:
        return res.status(400).json({ error: 'Unknown statistics operation' });
    }

    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Statistics error: ' + error.message });
  }
});

// Calculus operations
app.post('/api/calculus', (req, res) => {
  try {
    const { operation, function: funcStr, lowerLimit, upperLimit, point, precision = 1000 } = req.body;

    if (!validateFunction(funcStr)) {
      return res.status(400).json({ error: 'Invalid function' });
    }

    let result;
    const cacheKey = getCacheKey(operation, { funcStr, lowerLimit, upperLimit, point, precision });
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json({ result: cached });
    }

    switch (operation) {
      case 'integrate':
        if (typeof lowerLimit !== 'number' || typeof upperLimit !== 'number') {
          return res.status(400).json({ error: 'Invalid limits for integration' });
        }
        result = math.integral(funcStr, lowerLimit, upperLimit, precision);
        break;
      case 'differentiate':
        if (typeof point !== 'number') {
          return res.status(400).json({ error: 'Invalid point for differentiation' });
        }
        result = math.derivative(funcStr, point);
        break;
      case 'limit':
        if (typeof point !== 'number') {
          return res.status(400).json({ error: 'Invalid point for limit' });
        }
        result = math.limit(funcStr, point);
        break;
      default:
        return res.status(400).json({ error: 'Unknown calculus operation' });
    }

    setCache(cacheKey, result);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Calculus error: ' + error.message });
  }
});

// Equation solving
app.post('/api/solve', (req, res) => {
  try {
    const { equation, variable = 'x' } = req.body;

    if (!equation || typeof equation !== 'string') {
      return res.status(400).json({ error: 'Invalid equation' });
    }

    // For polynomial equations, try to solve
    const solutions = math.solve(equation, variable);
    res.json({ result: solutions });
  } catch (error) {
    res.status(400).json({ error: 'Equation solving error: ' + error.message });
  }
});

// Unit conversions
app.post('/api/convert', (req, res) => {
  try {
    const { value, fromUnit, toUnit } = req.body;

    if (typeof value !== 'number' || !fromUnit || !toUnit) {
      return res.status(400).json({ error: 'Invalid conversion parameters' });
    }

    const result = math.unit(value, fromUnit).to(toUnit);
    res.json({ result: result.toNumber() });
  } catch (error) {
    res.status(400).json({ error: 'Unit conversion error: ' + error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Scientific Calculator Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;