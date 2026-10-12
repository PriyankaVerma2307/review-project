const pool = require('../config/db');

const getDashboard = async (req, res) => {
  try {
    const storeResult = await pool.query(
      `SELECT
        id,
        name,
        email,
        address
       FROM stores
       WHERE owner_id = $1
       ORDER BY id ASC`,
      [req.user.id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No store is assigned to this owner'
      });
    }

    const store = storeResult.rows[0];

    const ratingsResult = await pool.query(
      `SELECT
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.address AS user_address,
        r.rating,
        r.created_at,
        r.updated_at
       FROM ratings r
       INNER JOIN users u
         ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY u.name ASC`,
      [store.id]
    );

    const averageResult = await pool.query(
      `SELECT
        COALESCE(ROUND(AVG(rating), 2), 0) AS average_rating
       FROM ratings
       WHERE store_id = $1`,
      [store.id]
    );

    res.json({
      success: true,
      dashboard: {
        store,
        averageRating: averageResult.rows[0].average_rating,
        totalRatings: ratingsResult.rows.length,
        ratings: ratingsResult.rows
      }
    });
  } catch (error) {
    console.error('Owner dashboard error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to load owner dashboard'
    });
  }
};

module.exports = {
  getDashboard
};
