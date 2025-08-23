const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/click', require('./routes/clicks'));
app.use('/postback', require('./routes/postbacks'));
app.use('/affiliates', require('./routes/affiliates'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Affiliate Tracking API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Affiliate Postback Tracking API',
    version: '1.0.0',
    endpoints: {
      'Track Click': 'GET /click?affiliate_id=1&campaign_id=1&click_id=abc123',
      'Track Conversion': 'GET /postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD',
      'Get Affiliates': 'GET /affiliates',
      'Get Affiliate Clicks': 'GET /affiliates/:id/clicks',
      'Get Affiliate Conversions': 'GET /affiliates/:id/conversions'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Affiliate Tracking API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API docs: http://localhost:${PORT}/`);
});