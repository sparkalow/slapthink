const path = require('path');
const dev = process.env.NODE_ENV !== 'production';
console.log('DEV ----- ', dev);
module.exports = {
    entry: './src/js/images.js',
    stats: 'errors-only',
    mode: dev ? 'development' : 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '_site'),
    },
};