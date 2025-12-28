const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint (test için)
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', ip: req.ip });
});

// Proxy endpoint
app.all('/api/*', async (req, res) => {
  const path = req.path.replace('/api/', ''); // /api/ kısmını çıkar
  const url = `https://api.trendyol.com/${path}`;
  
  console.log('Proxying to:', url);
  
  try {
    const response = await axios({
      method: req.method,
      url: url,
      headers: {
        ...req.headers,
        host: 'api.trendyol.com'
      },
      data: req.body,
      params: req.query
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: error.message }
    );
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});