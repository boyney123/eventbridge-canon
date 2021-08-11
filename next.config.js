const withTM = require('next-transpile-modules')(['lowdb']);

const path = require('path');

module.exports = withTM({
  reactStrictMode: true,
  devServer: {
    watchOptions: {
      ignored: [path.resolve(__dirname, 'data')],
    },
  },
});
