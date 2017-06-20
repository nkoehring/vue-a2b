import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import butternut from 'rollup-plugin-butternut'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

const plugins = [
  vue(),
  buble({
    objectAssign: 'Object.assign'
  }),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs(),
  nodeGlobals()
]

const config = {
  entry: './src/index.js',
  dest: './dist/index.js',
  treeshake: true,
  sourceMap: true,
  format: 'umd',
  moduleName: 'vueSplitter',
  plugins: plugins
}

const isProduction = process.env.NODE_ENV === `production`
const isDevelopment = process.env.NODE_ENV === `development`

if (isProduction) {
  config.sourceMap = false
  config.plugins.push(butternut)
}

if (isDevelopment) {
  config.plugins.push(livereload())
  config.plugins.push(serve({
    contentBase: './dist/',
    port: 8080,
    open: true
  }))
}

export default config
