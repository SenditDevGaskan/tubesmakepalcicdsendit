const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://sendit.aident.my.id',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.method, req.url, 'to', 'https://sendit.aident.my.id' + req.url);
      },
      onError: (err, req, res) => {
        console.log('Proxy error:', err.message);
      }
    })
  );
};