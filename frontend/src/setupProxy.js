/* eslint-disable */
const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/api", {
      target: "http://localhost:8080/",
      pathRewrite: { "^/api": "" } // remove api path
    })
  );
};
