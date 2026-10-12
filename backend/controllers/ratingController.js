const pool = require('../config/db');

const validateRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    if (!storeId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Store ID and rating are required'
      });
    }

    const numericRating = Number(rating);

    if (!validateRating(numericRating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE id = $1',
      [storeId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const existingRating = await pool.query(
      `SELECT id
       FROM ratings
       WHERE user_id = $1 AND store_id = $2`,
      [req.user.id, storeId]
    );

    if (existingRating.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You have already rated this store'
      });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, store_id, rating, created_at, updated_at`,
      [req.user.id, storeId, numericRating]
    );

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Submit rating error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    });
  }
};

const updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    if (rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required'
      });
    }

    const numericRating = Number(rating);

    if (!validateRating(numericRating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    const existingRating = await pool.query(
      `SELECT id
       FROM ratings
       WHERE user_id = $1 AND store_id = $2`,
      [req.user.id, storeId]
    );

    if (existingRating.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'You have not rated this store yet'
      });
    }

    const result = await pool.query(
      `UPDATE ratings
       SET rating = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND store_id = $3
       RETURNING id, user_id, store_id, rating, created_at, updated_at`,
      [numericRating, req.user.id, storeId]
    );

    res.json({
      success: true,
      message: 'Rating updated successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Update rating error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to update rating'
    });
  }
};

const getMyRatings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        r.id,
        r.store_id,
        s.name AS store_name,
        s.address AS store_address,
        r.rating,
        r.created_at,
        r.updated_at
       FROM ratings r
       INNER JOIN stores s ON s.id = r.store_id
       WHERE r.user_id = $1
       ORDER BY s.name ASC`,
      [req.user.id]
    );

    res.json({
      success: true,
      ratings: result.rows
    });
  } catch (error) {
    console.error('Get my ratings error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to load your ratings'
    });
  }
};

module.exports = {
  submitRating,
  updateRating,
  getMyRatings
};