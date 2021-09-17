import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'plugin/src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    plugins: [commonjs(), nodeResolve(), babel()],
  },
};
