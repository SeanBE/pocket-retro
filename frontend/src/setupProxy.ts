/* eslint-disable */
const proxy = require('http-proxy-middleware');

module.exports = function(app: any) {
  app.use(proxy('/api', {
    target: 'http://localhost:5000/',
    pathRewrite: { '^/api': '' }, // remove api path
  }));
};
