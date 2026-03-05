const https = require('https');

const keepAlive = () => {
  const url = process.env.RENDER_EXTERNAL_URL 
    ? `${process.env.RENDER_EXTERNAL_URL}/api/health`
    : 'https://flashbites-backend.onrender.com/api/health';

  setInterval(() => {
    https.get(url, (res) => {
      console.log(`[KeepAlive] Pinged self at ${new Date().toISOString()} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('[KeepAlive] Failed to ping self:', err.message);
    });
  }, 10 * 60 * 1000); // Every 10 minutes
};

module.exports = keepAlive;
