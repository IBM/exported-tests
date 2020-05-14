// Transpile
import babel from '@rollup/plugin-babel';
// Used to minify files
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default [{
  input: 'src/index.js',
  output: { // ES2015 (ES6) Module
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  },
  plugins: [terser()]
},{
  // Outputs we want to be transpiled by Babel
  input: 'src/index.js',
  output: [
    { // Common JS
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    { // Browser
      name: 'ExportedTests',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
    }
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser()
  ]
},

/**
 * DEPRECIATED FILES
 * @todo remove these on the next major release
 */
{
  input: 'src/index.js',
  output: { // ES2015 (ES6) Module
    file: 'index.js',
    format: 'es',
  },
},
{
  // Outputs we want to be transpiled by Babel
  input: 'src/index.js',
  output: [
    { // Common JS
      file: 'es5.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
  ]
}];
