# Scientific Calculator

A comprehensive scientific calculator designed for engineering students with all essential features for complex calculations.

## Features

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

### Matrix Operations
- Matrix addition and subtraction
- Matrix multiplication
- Determinant calculation (2x2, 3x3)
- Matrix inverse (2x2)
- Matrix transpose

### Complex Numbers
- Complex addition, subtraction, multiplication, division
- Complex conjugate
- Complex magnitude

### Statistics
- Mean, median, mode
- Standard deviation
- Variance

### Calculus
- Numerical integration (trapezoidal rule)
- Numerical differentiation (central difference)

## Usage

1. Open `frontend/index.html` in a web browser
2. Use the buttons for input or type expressions directly
3. Switch between DEG/RAD modes for trigonometric functions
4. Access advanced features through the special function buttons:
   - Matrix: Enter matrices in the text areas
   - Complex: Enter complex numbers in a+bi format
   - Stats: Enter comma-separated data
   - Calc: Enter function and limits for integration/differentiation

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Responsive design for mobile and desktop
- Fast and accurate calculations using JavaScript's Math library
- Numerical methods for advanced calculus operations
- Clean, intuitive UI with grouped functions for easy navigation

## Browser Support

Works in all modern web browsers that support ES6+ features.

## Running Locally

To run the calculator locally:

1. Navigate to the `frontend` directory
2. Start a local web server:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser

## Exam-Approved

This calculator is designed to be suitable for engineering examinations, providing accurate results without additional features that might be restricted.
