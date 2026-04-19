// Simple test script for backend API
// Run with: node test-backend.js

const http = require('http');

const API_BASE = 'http://localhost:3001/api';

function makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = API_BASE + endpoint;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('Testing Scientific Calculator Backend API...\n');

    try {
        // Test health check
        console.log('1. Testing health check...');
        const health = await makeRequest('/health');
        console.log('   Status:', health.status);
        console.log('   Response:', health.data);
        console.log('');

        // Test basic calculation
        console.log('2. Testing basic calculation...');
        const calc = await makeRequest('/calculate', 'POST', {
            expression: '2 + 3 * 4',
            angleMode: 'deg'
        });
        console.log('   Status:', calc.status);
        console.log('   Result:', calc.data);
        console.log('');

        // Test matrix operation
        console.log('3. Testing matrix determinant...');
        const matrix = await makeRequest('/matrix/operation', 'POST', {
            operation: 'determinant',
            matrixA: [[1, 2], [3, 4]]
        });
        console.log('   Status:', matrix.status);
        console.log('   Result:', matrix.data);
        console.log('');

        // Test complex number
        console.log('4. Testing complex number addition...');
        const complex = await makeRequest('/complex/operation', 'POST', {
            operation: 'add',
            complexA: { re: 1, im: 2 },
            complexB: { re: 3, im: 4 }
        });
        console.log('   Status:', complex.status);
        console.log('   Result:', complex.data);
        console.log('');

        // Test statistics
        console.log('5. Testing statistics (mean)...');
        const stats = await makeRequest('/statistics', 'POST', {
            operation: 'mean',
            data: ['1', '2', '3', '4', '5']
        });
        console.log('   Status:', stats.status);
        console.log('   Result:', stats.data);
        console.log('');

        console.log('All tests completed!');

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { makeRequest, runTests };