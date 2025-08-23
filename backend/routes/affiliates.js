const express = require('express');
const router = express.Router();
const pool = require('../database');

// Get all affiliates
// GET /affiliates
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM affiliates ORDER BY id'
    );

    res.json({
      status: 'success',
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching affiliates:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get affiliate clicks
// GET /affiliates/:id/clicks
router.get('/:id/clicks', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate affiliate exists
    const affiliateCheck = await pool.query(
      'SELECT id, name FROM affiliates WHERE id = $1',
      [id]
    );

    if (affiliateCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Affiliate not found'
      });
    }

    // Get clicks with campaign information
    const result = await pool.query(
      `SELECT c.id, c.click_id, c.timestamp, 
              camp.name as campaign_name, camp.id as campaign_id
       FROM clicks c
       JOIN campaigns camp ON c.campaign_id = camp.id
       WHERE c.affiliate_id = $1
       ORDER BY c.timestamp DESC`,
      [id]
    );

    res.json({
      status: 'success',
      data: {
        affiliate: affiliateCheck.rows[0],
        clicks: result.rows
      }
    });

  } catch (error) {
    console.error('Error fetching affiliate clicks:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get affiliate conversions
// GET /affiliates/:id/conversions
router.get('/:id/conversions', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate affiliate exists
    const affiliateCheck = await pool.query(
      'SELECT id, name FROM affiliates WHERE id = $1',
      [id]
    );

    if (affiliateCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Affiliate not found'
      });
    }

    // Get conversions with click and campaign information
    const result = await pool.query(
      `SELECT conv.id, conv.amount, conv.currency, conv.timestamp,
              c.click_id, camp.name as campaign_name
       FROM conversions conv
       JOIN clicks c ON conv.click_id = c.id
       JOIN campaigns camp ON c.campaign_id = camp.id
       WHERE c.affiliate_id = $1
       ORDER BY conv.timestamp DESC`,
      [id]
    );

    res.json({
      status: 'success',
      data: {
        affiliate: affiliateCheck.rows[0],
        conversions: result.rows
      }
    });

  } catch (error) {
    console.error('Error fetching affiliate conversions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;