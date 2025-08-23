const express = require('express');
const router = express.Router();
const pool = require('../database');

// Track Conversion (Postback)
// GET /postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
router.get('/postback', async (req, res) => {
  try {
    const { affiliate_id, click_id, amount, currency } = req.query;

    // Validate required parameters
    if (!affiliate_id || !click_id || !amount || !currency) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: affiliate_id, click_id, amount, currency'
      });
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid amount: must be a positive number'
      });
    }

    // Find the click record for the given affiliate and click_id
    const clickResult = await pool.query(
      `SELECT c.id, c.affiliate_id, c.campaign_id, c.click_id, c.timestamp
       FROM clicks c
       WHERE c.affiliate_id = $1 AND c.click_id = $2`,
      [affiliate_id, click_id]
    );

    if (clickResult.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid click: click not found for this affiliate'
      });
    }

    const click = clickResult.rows[0];

    // Check if conversion already exists for this click
    const existingConversion = await pool.query(
      'SELECT id FROM conversions WHERE click_id = $1',
      [click.id]
    );

    if (existingConversion.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Conversion already tracked for this click'
      });
    }

    // Insert conversion
    const conversionResult = await pool.query(
      'INSERT INTO conversions (click_id, amount, currency) VALUES ($1, $2, $3) RETURNING *',
      [click.id, amountNum, currency]
    );

    res.json({
      status: 'success',
      message: 'Conversion tracked',
      data: {
        conversion: conversionResult.rows[0],
        click: click
      }
    });

  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;