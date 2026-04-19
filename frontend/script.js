class ScientificCalculator {
    constructor() {
        this.display = {
            expression: document.querySelector('.expression'),
            result: document.querySelector('.result')
        };
        this.currentExpression = '';
        this.previousResult = '';
        this.memory = 0;
        this.angleMode = 'deg'; // 'deg' or 'rad'
        this.activePanel = null;
        this.apiBase = 'http://localhost:3001/api';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.checkBackendConnection();
    }

    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.apiBase}/health`);
            if (response.ok) {
                console.log('Backend connected successfully');
            } else {
                console.warn('Backend connection failed, falling back to client-side calculations');
            }
        } catch (error) {
            console.warn('Backend not available, using client-side calculations');
        }
    }

    bindEvents() {
        // Mode selector
        document.getElementById('deg').addEventListener('click', () => this.setAngleMode('deg'));
        document.getElementById('rad').addEventListener('click', () => this.setAngleMode('rad'));

        // Buttons
        document.querySelectorAll('button[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });

        // Panel buttons
        document.querySelectorAll('.panel button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handlePanelAction(action);
            });
        });
    }

    setAngleMode(mode) {
        this.angleMode = mode;
        document.getElementById('deg').classList.toggle('active', mode === 'deg');
        document.getElementById('rad').classList.toggle('active', mode === 'rad');
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case '=':
                this.calculate();
                break;
            case 'MC':
                this.memoryClear();
                break;
            case 'MR':
                this.memoryRecall();
                break;
            case 'MS':
                this.memoryStore();
                break;
            case 'M+':
                this.memoryAdd();
                break;
            case 'M-':
                this.memorySubtract();
                break;
            case 'matrix':
            case 'complex':
            case 'stats':
            case 'calc':
                this.showPanel(action);
                break;
            default:
                this.appendToExpression(action);
                break;
        }
    }

    handlePanelAction(action) {
        switch (action) {
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'determinant':
            case 'inverse':
            case 'transpose':
            case 'eigenvalues':
            case 'eigenvectors':
            case 'rank':
            case 'trace':
                this.matrixOperation(action);
                break;
            case 'complex-add':
            case 'complex-subtract':
            case 'complex-multiply':
            case 'complex-divide':
            case 'complex-conjugate':
            case 'complex-magnitude':
            case 'complex-argument':
            case 'complex-sqrt':
            case 'complex-exp':
            case 'complex-log':
            case 'complex-sin':
            case 'complex-cos':
            case 'complex-tan':
                this.complexOperation(action);
                break;
            case 'mean':
            case 'median':
            case 'mode':
            case 'std':
            case 'variance':
            case 'min':
            case 'max':
            case 'range':
            case 'sum':
            case 'product':
            case 'quantile':
                this.statisticOperation(action);
                break;
            case 'integrate':
            case 'differentiate':
            case 'limit':
                this.calculusOperation(action);
                break;
        }
    }

    showPanel(panelName) {
        // Hide all panels
        document.querySelectorAll('.panel').forEach(panel => panel.classList.add('hidden'));
        
        // Show selected panel
        const panel = document.getElementById(`${panelName}-panel`);
        if (panel) {
            panel.classList.remove('hidden');
            this.activePanel = panelName;
        }
    }

    appendToExpression(value) {
        this.currentExpression += value;
        this.updateDisplay();
    }

    clear() {
        this.currentExpression = '';
        this.previousResult = '';
        this.updateDisplay();
    }

    backspace() {
        this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateDisplay();
    }

    async calculate() {
        try {
            const response = await fetch(`${this.apiBase}/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expression: this.currentExpression,
                    angleMode: this.angleMode
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.previousResult = data.result;
                this.display.result.textContent = this.formatResult(data.result);
            } else {
                // Fallback to client-side calculation
                this.fallbackCalculate();
            }
        } catch (error) {
            // Fallback to client-side calculation
            this.fallbackCalculate();
        }
    }

    fallbackCalculate() {
        try {
            let expression = this.currentExpression;
            
            // Replace trigonometric functions with proper calls
            expression = expression.replace(/sin\(/g, `Math.sin(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`);
            expression = expression.replace(/cos\(/g, `Math.cos(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`);
            expression = expression.replace(/tan\(/g, `Math.tan(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`);
            expression = expression.replace(/asin\(/g, `Math.asin(`);
            expression = expression.replace(/acos\(/g, `Math.acos(`);
            expression = expression.replace(/atan\(/g, `Math.atan(`);
            
            // Convert inverse trig results to degrees if in deg mode
            if (this.angleMode === 'deg') {
                expression = expression.replace(/Math\.asin\(/g, `(180/Math.PI)*Math.asin(`);
                expression = expression.replace(/Math\.acos\(/g, `(180/Math.PI)*Math.acos(`);
                expression = expression.replace(/Math\.atan\(/g, `(180/Math.PI)*Math.atan(`);
            }
            
            // Replace other functions
            expression = expression.replace(/log\(/g, 'Math.log10(');
            expression = expression.replace(/ln\(/g, 'Math.log(');
            expression = expression.replace(/exp\(/g, 'Math.exp(');
            expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
            expression = expression.replace(/cbrt\(/g, 'Math.cbrt(');
            expression = expression.replace(/pi/g, 'Math.PI');
            expression = expression.replace(/e/g, 'Math.E');
            
            // Handle powers
            expression = expression.replace(/\^/g, '**');
            
            // Handle factorials
            expression = expression.replace(/(\d+)!/g, 'this.factorial($1)');
            
            // Handle absolute value
            expression = expression.replace(/\|([^|]+)\|/g, 'Math.abs($1)');
            
            // Handle inverse
            expression = expression.replace(/inv\(/g, '(1/');
            expression = expression.replace(/inv /g, '(1/');
            
            const result = eval(expression);
            this.previousResult = result;
            this.display.result.textContent = this.formatResult(result);
        } catch (error) {
            this.display.result.textContent = 'Error';
        }
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    formatResult(result) {
        if (typeof result === 'number') {
            if (isNaN(result)) return 'NaN';
            if (!isFinite(result)) return result > 0 ? '∞' : '-∞';
            return result.toPrecision(10).replace(/\.?0+$/, '');
        }
        return result;
    }

    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.currentExpression += this.memory.toString();
        this.updateDisplay();
    }

    memoryStore() {
        if (this.previousResult) {
            this.memory = parseFloat(this.previousResult);
        }
    }

    memoryAdd() {
        if (this.previousResult) {
            this.memory += parseFloat(this.previousResult);
        }
    }

    memorySubtract() {
        if (this.previousResult) {
            this.memory -= parseFloat(this.previousResult);
        }
    }

    // Matrix operations using backend
    async matrixOperation(operation) {
        const matrixA = this.parseMatrix(document.getElementById('matrix-a').value);
        const matrixB = operation !== 'determinant' && operation !== 'inverse' && operation !== 'transpose' && operation !== 'eigenvalues' && operation !== 'eigenvectors' && operation !== 'rank' && operation !== 'trace' 
            ? this.parseMatrix(document.getElementById('matrix-b').value) 
            : null;
        
        if (!matrixA || (matrixB === null && this.needsMatrixB(operation))) {
            alert('Invalid matrix format');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/matrix/operation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation,
                    matrixA,
                    matrixB
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.display.result.textContent = this.formatMatrix(data.result);
            } else {
                // Fallback to client-side
                this.fallbackMatrixOperation(operation, matrixA, matrixB);
            }
        } catch (error) {
            // Fallback to client-side
            this.fallbackMatrixOperation(operation, matrixA, matrixB);
        }
    }

    needsMatrixB(operation) {
        return ['add', 'subtract', 'multiply'].includes(operation);
    }

    // Complex number operations using backend
    async complexOperation(operation) {
        const complexA = this.parseComplex(document.getElementById('complex-a').value);
        const complexB = operation !== 'complex-conjugate' && operation !== 'complex-magnitude' && operation !== 'complex-argument' && operation !== 'complex-sqrt' && operation !== 'complex-exp' && operation !== 'complex-log' && operation !== 'complex-sin' && operation !== 'complex-cos' && operation !== 'complex-tan'
            ? this.parseComplex(document.getElementById('complex-b').value)
            : null;
        
        if (!complexA || (complexB === null && this.needsComplexB(operation))) {
            alert('Invalid complex number format');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/complex/operation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: operation.replace('complex-', ''),
                    complexA,
                    complexB
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.display.result.textContent = this.formatComplex(data.result);
            } else {
                // Fallback to client-side
                this.fallbackComplexOperation(operation, complexA, complexB);
            }
        } catch (error) {
            // Fallback to client-side
            this.fallbackComplexOperation(operation, complexA, complexB);
        }
    }

    needsComplexB(operation) {
        return ['complex-add', 'complex-subtract', 'complex-multiply', 'complex-divide'].includes(operation);
    }

    // Statistics operations using backend
    async statisticOperation(operation) {
        const dataText = document.getElementById('data-input').value;
        const data = dataText.split(',').map(x => x.trim());
        
        if (data.length === 0) {
            alert('No data entered');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/statistics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation,
                    data
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.display.result.textContent = Array.isArray(data.result) ? data.result.join(', ') : data.result;
            } else {
                // Fallback to client-side
                this.fallbackStatisticOperation(operation, data);
            }
        } catch (error) {
            // Fallback to client-side
            this.fallbackStatisticOperation(operation, data);
        }
    }

    // Calculus operations using backend
    async calculusOperation(operation) {
        const funcText = document.getElementById('function-input').value;
        const lower = parseFloat(document.getElementById('lower-limit').value);
        const upper = parseFloat(document.getElementById('upper-limit').value);
        const point = parseFloat(document.getElementById('lower-limit').value); // Using lower limit as point for differentiation
        
        if (!funcText) {
            alert('Invalid input');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/calculus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation,
                    function: funcText,
                    lowerLimit: lower,
                    upperLimit: upper,
                    point: point
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.display.result.textContent = data.result;
            } else {
                // Fallback to client-side
                this.fallbackCalculusOperation(operation, funcText, lower, upper, point);
            }
        } catch (error) {
            // Fallback to client-side
            this.fallbackCalculusOperation(operation, funcText, lower, upper, point);
        }
    }

    // Fallback methods for when backend is not available
    fallbackMatrixOperation(operation, matrixA, matrixB) {
        // Use existing client-side matrix operations
        let result;
        switch (operation) {
            case 'add':
                result = this.matrixAdd(matrixA, matrixB);
                break;
            case 'subtract':
                result = this.matrixSubtract(matrixA, matrixB);
                break;
            case 'multiply':
                result = this.matrixMultiply(matrixA, matrixB);
                break;
            case 'determinant':
                result = [[this.calculateDeterminant(matrixA)]];
                break;
            case 'inverse':
                result = this.calculateInverse(matrixA);
                break;
            case 'transpose':
                result = this.calculateTranspose(matrixA);
                break;
            default:
                result = null;
        }
        
        if (result) {
            this.display.result.textContent = this.formatMatrix(result);
        } else {
            this.display.result.textContent = 'Operation not supported in offline mode';
        }
    }

    fallbackComplexOperation(operation, complexA, complexB) {
        // Use existing client-side complex operations
        let result;
        const op = operation.replace('complex-', '');
        
        switch (op) {
            case 'add':
                result = this.complexAdd(complexA, complexB);
                break;
            case 'subtract':
                result = this.complexSubtract(complexA, complexB);
                break;
            case 'multiply':
                result = this.complexMultiply(complexA, complexB);
                break;
            case 'divide':
                result = this.complexDivide(complexA, complexB);
                break;
            case 'conjugate':
                result = { real: complexA.real, imag: -complexA.imag };
                break;
            case 'magnitude':
                result = { real: Math.sqrt(complexA.real * complexA.real + complexA.imag * complexA.imag), imag: 0 };
                break;
            default:
                result = null;
        }
        
        if (result) {
            this.display.result.textContent = this.formatComplex(result);
        } else {
            this.display.result.textContent = 'Operation not supported in offline mode';
        }
    }

    fallbackStatisticOperation(operation, data) {
        const numericData = data.map(x => parseFloat(x)).filter(x => !isNaN(x));
        if (numericData.length === 0) {
            alert('No valid data');
            return;
        }
        
        let result;
        switch (operation) {
            case 'mean':
                result = this.calculateMean(numericData);
                break;
            case 'median':
                result = this.calculateMedian(numericData);
                break;
            case 'mode':
                result = this.calculateMode(numericData);
                break;
            case 'std':
                result = this.calculateStdDev(numericData);
                break;
            case 'variance':
                result = this.calculateVariance(numericData);
                break;
            default:
                result = 'Operation not supported in offline mode';
        }
        
        this.display.result.textContent = result;
    }

    fallbackCalculusOperation(operation, funcText, lower, upper, point) {
        try {
            let result;
            switch (operation) {
                case 'integrate':
                    result = this.numericalIntegrate(funcText, lower, upper);
                    break;
                case 'differentiate':
                    result = this.numericalDifferentiate(funcText, point);
                    break;
                default:
                    result = 'Operation not supported in offline mode';
            }
            this.display.result.textContent = result;
        } catch (error) {
            this.display.result.textContent = 'Calculus error in offline mode';
        }
    }

    // Existing helper methods (parseMatrix, formatMatrix, etc.)
    parseMatrix(text) {
        try {
            const rows = text.trim().split('\n');
            return rows.map(row => row.split(/\s+/).map(Number));
        } catch {
            return null;
        }
    }

    formatMatrix(matrix) {
        if (Array.isArray(matrix) && matrix.length > 0 && Array.isArray(matrix[0])) {
            return matrix.map(row => row.join(' ')).join('\n');
        }
        return matrix;
    }

    matrixAdd(a, b) {
        if (a.length !== b.length || a[0].length !== b[0].length) return null;
        return a.map((row, i) => row.map((val, j) => val + b[i][j]));
    }

    matrixSubtract(a, b) {
        if (a.length !== b.length || a[0].length !== b[0].length) return null;
        return a.map((row, i) => row.map((val, j) => val - b[i][j]));
    }

    matrixMultiply(a, b) {
        if (a[0].length !== b.length) return null;
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result[i] = [];
            for (let j = 0; j < b[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < a[0].length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    calculateDeterminant(matrix) {
        if (matrix.length === 2 && matrix[0].length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        if (matrix.length === 3 && matrix[0].length === 3) {
            const [a, b, c] = matrix[0];
            const [d, e, f] = matrix[1];
            const [g, h, i] = matrix[2];
            return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
        }
        return 'Determinant calculation for matrices larger than 3x3 not implemented';
    }

    calculateInverse(matrix) {
        if (matrix.length === 2 && matrix[0].length === 2) {
            const det = this.calculateDeterminant(matrix);
            if (det === 0) return null;
            return [
                [matrix[1][1] / det, -matrix[0][1] / det],
                [-matrix[1][0] / det, matrix[0][0] / det]
            ];
        }
        return null;
    }

    calculateTranspose(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const transpose = [];
        for (let j = 0; j < cols; j++) {
            transpose[j] = [];
            for (let i = 0; i < rows; i++) {
                transpose[j][i] = matrix[i][j];
            }
        }
        return transpose;
    }

    parseComplex(text) {
        const match = text.match(/^([+-]?\d*\.?\d+)\s*([+-]\s*\d*\.?\d*)i?$/);
        if (!match) return null;
        
        const real = parseFloat(match[1]);
        const imag = match[2] ? parseFloat(match[2].replace(/\s/g, '')) : 0;
        
        return { re: real, im: imag };
    }

    formatComplex(z) {
        if (z.im === 0) return z.re.toString();
        if (z.re === 0) return z.im === 1 ? 'i' : z.im === -1 ? '-i' : `${z.im}i`;
        const sign = z.im >= 0 ? '+' : '';
        return `${z.re}${sign}${z.im === 1 ? '' : z.im === -1 ? '-' : z.im}i`;
    }

    complexAdd(a, b) {
        return { re: a.re + b.re, im: a.im + b.im };
    }

    complexSubtract(a, b) {
        return { re: a.re - b.re, im: a.im - b.im };
    }

    complexMultiply(a, b) {
        return {
            re: a.re * b.re - a.im * b.im,
            im: a.re * b.im + a.im * b.re
        };
    }

    complexDivide(a, b) {
        const denominator = b.re * b.re + b.im * b.im;
        return {
            re: (a.re * b.re + a.im * b.im) / denominator,
            im: (a.im * b.re - a.re * b.im) / denominator
        };
    }

    calculateMean(data) {
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    calculateMedian(data) {
        const sorted = [...data].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }

    calculateMode(data) {
        const counts = {};
        data.forEach(val => counts[val] = (counts[val] || 0) + 1);
        const maxCount = Math.max(...Object.values(counts));
        const modes = Object.keys(counts).filter(key => counts[key] === maxCount);
        return modes.length === 1 ? parseFloat(modes[0]) : modes.map(Number);
    }

    calculateVariance(data) {
        const mean = this.calculateMean(data);
        return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    }

    calculateStdDev(data) {
        return Math.sqrt(this.calculateVariance(data));
    }

    numericalIntegrate(funcText, a, b, n = 1000) {
        const h = (b - a) / n;
        let sum = 0;
        
        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            const y = this.evaluateFunction(funcText, x);
            if (i === 0 || i === n) {
                sum += y;
            } else {
                sum += 2 * y;
            }
        }
        
        return (h / 2) * sum;
    }

    numericalDifferentiate(funcText, x, h = 0.0001) {
        const f = (val) => this.evaluateFunction(funcText, val);
        return (f(x + h) - f(x - h)) / (2 * h);
    }

    evaluateFunction(funcText, x) {
        let expression = funcText.replace(/x/g, `(${x})`);
        
        expression = expression.replace(/sin\(/g, `Math.sin(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`);
        expression = expression.replace(/cos\(/g, `Math.cos(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`);
        expression = expression.replace(/tan\(/g, `Math.tan(${this.angleMode === 'deg' ? '(Math.PI/180)*' : ''}`);
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/exp\(/g, 'Math.exp(');
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
        expression = expression.replace(/pi/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');
        expression = expression.replace(/\^/g, '**');
        
        return eval(expression);
    }

    updateDisplay() {
        this.display.expression.textContent = this.currentExpression || '0';
    }
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
});