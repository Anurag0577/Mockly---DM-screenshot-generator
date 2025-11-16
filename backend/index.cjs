// backend/index.cjs (Guaranteed CJS Entry Point)

// 1. Synchronously require and configure Babel Register
require('@babel/register')({
  // Presets must be installed in the backend package.json
  presets: [
    ['@babel/preset-env', { modules: false }], 
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  cache: false,
  ignore: [/(node_modules)/], 
});

// 2. Load the main application entry point *after* Babel is active.
// Note: This file (server.js) can now safely use 'import' syntax.
require('./src/app.js');