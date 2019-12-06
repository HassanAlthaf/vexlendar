const path = require('path');

module.exports = {
    entry: './src/vexlendar.js',
    output: {
        filename: 'vexlendar.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
};