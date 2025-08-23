const express = require('express');
const router = express.Router();
const pool = require('../database');

// Track Click
// GET /click?affiliate_id=1&campaign_id=10&click_id=abc123
router.get('/click', async (req, res) => {
  try {
    const { affiliate_id, campaign_id, click_id } = req.query;

    // Validate required parameters
    if (!affiliate_id || !campaign_id || !click_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: affiliate_id, campaign_id, click_id'
      });
    }

    // Check if affiliate and campaign exist
    const affiliateCheck = await pool.query(
      'SELECT id FROM affiliates WHERE id = $1',
      [affiliate_id]
    );

    const campaignCheck = await pool.query(
      'SELECT id FROM campaigns WHERE id = $1',
      [campaign_id]
    );

    if (affiliateCheck.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid affiliate_id'
      });
    }

    if (campaignCheck.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid campaign_id'
      });
    }

    // Insert click
    const result = await pool.query(
      'INSERT INTO clicks (affiliate_id, campaign_id, click_id) VALUES ($1, $2, $3) RETURNING *',
      [affiliate_id, campaign_id, click_id]
    );

    res.json({
      status: 'success',
      message: 'Click tracked',
      data: result.rows[0]
    });

  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({
        status: 'error',
        message: 'Click already tracked for this affiliate and campaign'
      });
    }

    console.error('Error tracking click:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;