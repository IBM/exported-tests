// Transpile
import babel from '@rollup/plugin-babel';
// Used to minify files
import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: { // ES2015 (ES6) Module
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      // Can't figure out how to get Rollup to create the declaration files (.d.ts)
      // with the TypeScript plugin. Trying to define the declaration configs in the
      // tsconfig.json file creates errors for Rollup; defining the configurations in
      // Rollup has required properties that conflict with Rollup. I'm not sure if
      // having them created separately by TypeScript will allow our users to properly
      // map to the minified files created by Rollup.
      typescript(),
      terser()
    ]
  },
  {
    // Outputs we want to be transpiled by Babel
    input: 'src/index.ts',
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
      typescript(),
      babel({ babelHelpers: 'bundled' }),
      terser()
    ]
  },

  /**
   * DEPRECIATED FILES
   * @todo remove these on the next major release
   */
  {
    input: 'src/index.ts',
    output: { // ES2015 (ES6) Module
      file: 'index.js',
      format: 'es',
    },
    plugins: [
      typescript(),
    ]
  },
  {
    // Outputs we want to be transpiled by Babel
    input: 'src/index.ts',
    output: [
      { // Common JS
        file: 'es5.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      babel({ babelHelpers: 'bundled' }),
    ]
  }
];
