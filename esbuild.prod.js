require('esbuild').build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outfile: './dist/index.js',
  logLevel: 'info',
  define: { 'process.env.NODE_ENV': '"production"' },
}).catch(err => {
  console.error(err)
  process.exit(1)
})
