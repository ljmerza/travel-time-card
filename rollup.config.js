import resolve from 'rollup-plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/travel-time-card.js',
    format: 'umd',
    name: 'TravelTime',
  },
  plugins: [resolve(), json()],
};
