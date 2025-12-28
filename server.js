const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.all('/api/*', async (req, res) => {
  const url = `https://api.trendyol.com/${req.params[0]}`;
  
  try {
    const response = await axios({
      method: req.method,
      url: url,
      headers: req.headers,
      data: req.body,
      params: req.query
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
});

app.listen(process.env.PORT || 3000);