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
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
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
                this.matrixOperation(action);
                break;
            case 'determinant':
                this.matrixDeterminant();
                break;
            case 'inverse':
                this.matrixInverse();
                break;
            case 'transpose':
                this.matrixTranspose();
                break;
            case 'complex-add':
            case 'complex-subtract':
            case 'complex-multiply':
            case 'complex-divide':
                this.complexOperation(action);
                break;
            case 'complex-conjugate':
                this.complexConjugate();
                break;
            case 'complex-magnitude':
                this.complexMagnitude();
                break;
            case 'mean':
            case 'median':
            case 'mode':
            case 'stddev':
            case 'variance':
                this.statisticOperation(action);
                break;
            case 'integrate':
                this.integrate();
                break;
            case 'differentiate':
                this.differentiate();
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

    calculate() {
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

    // Matrix operations
    matrixOperation(operation) {
        const matrixA = this.parseMatrix(document.getElementById('matrix-a').value);
        const matrixB = this.parseMatrix(document.getElementById('matrix-b').value);
        
        if (!matrixA || !matrixB) {
            alert('Invalid matrix format');
            return;
        }
        
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
        }
        
        if (result) {
            this.display.result.textContent = this.formatMatrix(result);
        }
    }

    matrixDeterminant() {
        const matrix = this.parseMatrix(document.getElementById('matrix-a').value);
        if (!matrix) {
            alert('Invalid matrix format');
            return;
        }
        
        const det = this.calculateDeterminant(matrix);
        this.display.result.textContent = det;
    }

    matrixInverse() {
        const matrix = this.parseMatrix(document.getElementById('matrix-a').value);
        if (!matrix) {
            alert('Invalid matrix format');
            return;
        }
        
        const inverse = this.calculateInverse(matrix);
        if (inverse) {
            this.display.result.textContent = this.formatMatrix(inverse);
        } else {
            this.display.result.textContent = 'Matrix is not invertible';
        }
    }

    matrixTranspose() {
        const matrix = this.parseMatrix(document.getElementById('matrix-a').value);
        if (!matrix) {
            alert('Invalid matrix format');
            return;
        }
        
        const transpose = this.calculateTranspose(matrix);
        this.display.result.textContent = this.formatMatrix(transpose);
    }

    parseMatrix(text) {
        try {
            const rows = text.trim().split('\n');
            return rows.map(row => row.split(/\s+/).map(Number));
        } catch {
            return null;
        }
    }

    formatMatrix(matrix) {
        return matrix.map(row => row.join(' ')).join('\n');
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
        // Simple implementation for 2x2 and 3x3 matrices
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
        // Simple implementation for 2x2 matrices
        if (matrix.length === 2 && matrix[0].length === 2) {
            const det = this.calculateDeterminant(matrix);
            if (det === 0) return null;
            return [
                [matrix[1][1] / det, -matrix[0][1] / det],
                [-matrix[1][0] / det, matrix[0][0] / det]
            ];
        }
        return null; // Inverse for larger matrices not implemented
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

    // Complex number operations
    complexOperation(operation) {
        const a = this.parseComplex(document.getElementById('complex-a').value);
        const b = this.parseComplex(document.getElementById('complex-b').value);
        
        if (!a || !b) {
            alert('Invalid complex number format');
            return;
        }
        
        let result;
        switch (operation) {
            case 'complex-add':
                result = this.complexAdd(a, b);
                break;
            case 'complex-subtract':
                result = this.complexSubtract(a, b);
                break;
            case 'complex-multiply':
                result = this.complexMultiply(a, b);
                break;
            case 'complex-divide':
                result = this.complexDivide(a, b);
                break;
        }
        
        this.display.result.textContent = this.formatComplex(result);
    }

    complexConjugate() {
        const z = this.parseComplex(document.getElementById('complex-a').value);
        if (!z) {
            alert('Invalid complex number format');
            return;
        }
        const conjugate = { real: z.real, imag: -z.imag };
        this.display.result.textContent = this.formatComplex(conjugate);
    }

    complexMagnitude() {
        const z = this.parseComplex(document.getElementById('complex-a').value);
        if (!z) {
            alert('Invalid complex number format');
            return;
        }
        const magnitude = Math.sqrt(z.real * z.real + z.imag * z.imag);
        this.display.result.textContent = magnitude;
    }

    parseComplex(text) {
        // Simple parser for a + bi format
        const match = text.match(/^([+-]?\d*\.?\d+)\s*([+-]\s*\d*\.?\d*)i?$/);
        if (!match) return null;
        
        const real = parseFloat(match[1]);
        const imag = match[2] ? parseFloat(match[2].replace(/\s/g, '')) : 0;
        
        return { real, imag };
    }

    formatComplex(z) {
        if (z.imag === 0) return z.real.toString();
        if (z.real === 0) return z.imag === 1 ? 'i' : z.imag === -1 ? '-i' : `${z.imag}i`;
        const sign = z.imag >= 0 ? '+' : '';
        return `${z.real}${sign}${z.imag === 1 ? '' : z.imag === -1 ? '-' : z.imag}i`;
    }

    complexAdd(a, b) {
        return { real: a.real + b.real, imag: a.imag + b.imag };
    }

    complexSubtract(a, b) {
        return { real: a.real - b.real, imag: a.imag - b.imag };
    }

    complexMultiply(a, b) {
        return {
            real: a.real * b.real - a.imag * b.imag,
            imag: a.real * b.imag + a.imag * b.real
        };
    }

    complexDivide(a, b) {
        const denominator = b.real * b.real + b.imag * b.imag;
        return {
            real: (a.real * b.real + a.imag * b.imag) / denominator,
            imag: (a.imag * b.real - a.real * b.imag) / denominator
        };
    }

    // Statistics operations
    statisticOperation(operation) {
        const dataText = document.getElementById('data-input').value;
        const data = dataText.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
        
        if (data.length === 0) {
            alert('No valid data entered');
            return;
        }
        
        let result;
        switch (operation) {
            case 'mean':
                result = this.calculateMean(data);
                break;
            case 'median':
                result = this.calculateMedian(data);
                break;
            case 'mode':
                result = this.calculateMode(data);
                break;
            case 'stddev':
                result = this.calculateStdDev(data);
                break;
            case 'variance':
                result = this.calculateVariance(data);
                break;
        }
        
        this.display.result.textContent = result;
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

    // Calculus operations
    integrate() {
        const funcText = document.getElementById('function-input').value;
        const lower = parseFloat(document.getElementById('lower-limit').value);
        const upper = parseFloat(document.getElementById('upper-limit').value);
        
        if (!funcText || isNaN(lower) || isNaN(upper)) {
            alert('Invalid input');
            return;
        }
        
        try {
            const result = this.numericalIntegrate(funcText, lower, upper);
            this.display.result.textContent = result;
        } catch (error) {
            this.display.result.textContent = 'Integration error';
        }
    }

    differentiate() {
        const funcText = document.getElementById('function-input').value;
        const point = parseFloat(document.getElementById('lower-limit').value);
        
        if (!funcText || isNaN(point)) {
            alert('Invalid input');
            return;
        }
        
        try {
            const result = this.numericalDifferentiate(funcText, point);
            this.display.result.textContent = result;
        } catch (error) {
            this.display.result.textContent = 'Differentiation error';
        }
    }

    numericalIntegrate(funcText, a, b, n = 1000) {
        // Trapezoidal rule
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
        // Central difference
        const f = (val) => this.evaluateFunction(funcText, val);
        return (f(x + h) - f(x - h)) / (2 * h);
    }

    evaluateFunction(funcText, x) {
        // Replace x with the value
        let expression = funcText.replace(/x/g, `(${x})`);
        
        // Add trigonometric functions
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