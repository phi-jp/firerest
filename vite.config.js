// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    // minify: false,
    // rollupOptions: {
    //   output: [
    //     {
    //       format: 'amd',
    //     },
    //     {
    //       format: 'cjs',
    //     },
    //     {
    //       format: 'es',
    //     },
    //     {
    //       format: 'iife',
    //     },
    //     {
    //       format: 'umd',
    //     }
    //   ],
    // },
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'firerest',
      fileName: (format) => `firerest.${format}.js`
    },
  },
})
