const pool = require('../config/db');

const getStores = async (req, res) => {
  try {
    const {
      name = '',
      address = ''
    } = req.query;

    const values = [req.user.id];
    const conditions = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`s.name ILIKE $${values.length}`);
    }

    if (address) {
      values.push(`%${address}%`);
      conditions.push(`s.address ILIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(all_ratings.rating), 2), 0) AS average_rating,
        my_rating.rating AS user_rating
      FROM stores s
      LEFT JOIN ratings all_ratings
        ON all_ratings.store_id = s.id
      LEFT JOIN ratings my_rating
        ON my_rating.store_id = s.id
        AND my_rating.user_id = $1
      ${whereClause}
      GROUP BY
        s.id,
        my_rating.rating
      ORDER BY s.name ASC
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      stores: result.rows
    });
  } catch (error) {
    console.error('Get stores error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to load stores'
    });
  }
};
module.exports = {
  getStores
};