# Scientific Calculator

A comprehensive scientific calculator designed for engineering students with all essential features for complex calculations. Features a powerful Node.js backend with mathjs for high-precision computations and a responsive frontend with fallback capabilities.

## Features

### Backend-Powered Calculations (High Precision)
- **Math.js Integration**: Uses mathjs library for accurate, high-precision mathematical operations
- **Caching System**: Intelligent caching for expensive calculations to improve performance
- **Error Handling**: Comprehensive error handling and validation
- **API-First Design**: RESTful API endpoints for all mathematical operations

### Basic Arithmetic
- Addition, subtraction, multiplication, division
- Decimal point and π constant
- Clear and backspace functions

### Trigonometric Functions
- sin, cos, tan (with degree/radian mode switching)
- Inverse trigonometric functions (asin, acos, atan)
- Degree/Radian mode toggle

### Logarithmic & Exponential
- log (base 10)
- ln (natural log)
- e^x
- 10^x

### Powers & Roots
- x^y (power function)
- √ (square root)
- ∛ (cube root)
- y√x (nth root)

### Advanced Functions
- n! (factorial)
- |x| (absolute value)
- 1/x (inverse)
- mod (modulo)

### Constants
- π (pi)
- e (Euler's number)
- φ (golden ratio)
- c (speed of light)
- g (gravitational acceleration)

### Memory Functions
- MC (memory clear)
- MR (memory recall)
- MS (memory store)
- M+ (memory add)
- M- (memory subtract)

### Matrix Operations (Backend Powered)
- Matrix addition and subtraction
- Matrix multiplication
- Determinant calculation (any size)
- Matrix inverse (any size)
- Matrix transpose
- Eigenvalues and eigenvectors
- Matrix rank and trace

### Complex Numbers (Backend Powered)
- Complex addition, subtraction, multiplication, division
- Complex conjugate
- Complex magnitude and argument
- Complex exponential, logarithm, trigonometric functions
- Complex square root

### Statistics (Backend Powered)
- Mean, median, mode
- Standard deviation and variance
- Min, max, range
- Sum and product
- Quantiles (25th, 50th, 75th percentiles)

### Calculus (Backend Powered)
- Numerical integration (adaptive algorithms)
- Numerical differentiation
- Limit calculation

### Additional Features
- Unit conversions
- Equation solving
- High-precision calculations with BigNumber support

## Architecture

### Backend (Node.js + Express + Math.js)
- **server.js**: Main server with API endpoints
- **package.json**: Dependencies and scripts
- **Features**:
  - RESTful API design
  - Math.js for high-precision math
  - Intelligent caching system
  - Comprehensive error handling
  - CORS enabled for frontend communication

### Frontend (Vanilla JavaScript)
- **index.html**: Calculator interface
- **style.css**: Responsive styling
- **script.js**: Frontend logic with API integration
- **Features**:
  - API-first design with fallback to client-side calculations
  - Responsive design for mobile and desktop
  - Real-time backend connection checking
  - Graceful degradation when backend unavailable

## Setup Instructions

### Prerequisites
- Node.js (for backend)
- Python 3.x (for frontend server)
- npm (Node package manager)

### Installation

1. **Clone or download the repository**

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start the application:**
   
   **Option 1: Using the provided scripts**
   ```bash
   # Windows
   start.bat
   
   # PowerShell
   .\start.ps1
   ```
   
   **Option 2: Manual startup**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm start
   
   # Terminal 2: Start frontend
   cd frontend
   python -m http.server 8000
   ```

4. **Access the calculator:**
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/api/health

## API Endpoints

### Core Calculations
- `POST /api/calculate` - Basic expression evaluation
- `POST /api/solve` - Equation solving
- `POST /api/convert` - Unit conversions

### Matrix Operations
- `POST /api/matrix/operation` - Matrix calculations (add, subtract, multiply, determinant, inverse, transpose, eigenvalues, eigenvectors, rank, trace)

### Complex Numbers
- `POST /api/complex/operation` - Complex number operations (add, subtract, multiply, divide, conjugate, magnitude, argument, sqrt, exp, log, sin, cos, tan)

### Statistics
- `POST /api/statistics` - Statistical calculations (mean, median, mode, std, variance, min, max, range, sum, product, quantile)

### Calculus
- `POST /api/calculus` - Calculus operations (integrate, differentiate, limit)

### System
- `GET /api/health` - Health check endpoint

## Technical Details

### Backend Performance
- **Math.js Library**: Industry-standard mathematical library with BigNumber support
- **Caching**: LRU cache for expensive calculations (size: 1000)
- **Precision**: 64-bit precision for all calculations
- **Error Handling**: Comprehensive validation and error responses
- **CORS**: Cross-origin resource sharing enabled

### Frontend Features
- **API Integration**: Primary calculation method with backend
- **Fallback System**: Automatic fallback to client-side calculations if backend unavailable
- **Connection Monitoring**: Real-time backend connectivity checking
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with grouped functions

### Security
- Input validation on both frontend and backend
- Sanitized mathematical expressions
- CORS protection
- No eval() usage on backend (safe expression evaluation)

## Usage Examples

### Matrix Operations
```
Matrix A:
1 2
3 4

Matrix B:
5 6
7 8

Operations: A + B, A × B, det(A), A⁻¹, etc.
```

### Complex Numbers
```
Input: 3 + 4i
Operations: conjugate, magnitude, exp, log, sin, etc.
```

### Calculus
```
Function: x^2 + 2*x + 1
Integration: from 0 to 1
Differentiation: at point x = 2
```

### Statistics
```
Data: 1, 2, 3, 4, 5
Operations: mean, median, std deviation, etc.
```

## Exam-Approved

This calculator is designed to be suitable for engineering examinations, providing accurate results without additional features that might be restricted. The backend ensures high precision and reliability for critical calculations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
