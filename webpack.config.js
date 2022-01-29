// import path from 'path';
const conf = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'subito-lib.js',
    // path: path.resolve(__dirname, '/Users/xavierherriot/SoMAFAG/subito-libdist'),
    path: '/Users/xavierherriot/SoMAFAG/subito-lib/dist',
  },
  resolve: {
    fallback: {
      crypto: false,
      buffer: false,
      util: false,
      stream: false,
    },
  },
};

export default conf;
