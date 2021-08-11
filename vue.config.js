module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.31.200:3001',
      },
    },
  },
};
