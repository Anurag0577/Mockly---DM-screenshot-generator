// Custom ESM loader for Babel transformation
import { transformSync } from '@babel/core';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

export async function load(url, context, defaultLoad) {
  // Only process .js and .jsx files from our source directory
  if (url.endsWith('.js') || url.endsWith('.jsx')) {
    // Skip node_modules
    if (url.includes('node_modules')) {
      return defaultLoad(url, context, defaultLoad);
    }
    
    try {
      const filePath = fileURLToPath(url);
      const source = readFileSync(filePath, 'utf-8');
      
      const transformed = transformSync(source, {
        filename: filePath,
        presets: [
          ['@babel/preset-env', { modules: false }],
          ['@babel/preset-react', { runtime: 'automatic' }]
        ],
        sourceMaps: 'inline',
      });
      
      return {
        format: 'module',
        source: transformed.code,
        shortCircuit: true,
      };
    } catch (error) {
      // If transformation fails, fall back to default loader
      console.error('Babel transformation error:', error);
      return defaultLoad(url, context, defaultLoad);
    }
  }
  
  // For other files, use the default loader
  return defaultLoad(url, context, defaultLoad);
}

