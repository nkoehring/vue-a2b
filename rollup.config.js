import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import butternut from 'rollup-plugin-butternut'

const plugins = [
  buble({
    objectAssign: 'Object.assign'
  }),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs(),
  nodeGlobals(),
  butternut()
]

const config = {
  entry: './src/index.js',
  dest: './dist/index.js',
  treeshake: true,
  sourceMap: true,
  format: 'umd',
  moduleName: 'vueSplitter',
  plugins
}

export default config
