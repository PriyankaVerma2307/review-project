const bcrypt = require("bcrypt");
const pool = require("../config/db");

const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    password.length <= 16 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const getDashboard = async (req, res) => {
  try {
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");

    const storesResult = await pool.query("SELECT COUNT(*) FROM stores");

    const ratingsResult = await pool.query("SELECT COUNT(*) FROM ratings");

    res.json({
      success: true,
      dashboard: {
        totalUsers: Number(usersResult.rows[0].count),
        totalStores: Number(storesResult.rows[0].count),
        totalRatings: Number(ratingsResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAddress = address.trim();

    if (cleanName.length < 20 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (cleanAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!["user", "admin", "owner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be user, admin or owner",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [cleanEmail],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role`,
      [cleanName, cleanEmail, hashedPassword, cleanAddress, role],
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Create user error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, email and address are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAddress = address.trim();

    if (cleanName.length < 20 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (cleanAddress.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters",
      });
    }

    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (ownerId) {
      const ownerResult = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND role = $2",
        [ownerId, "owner"],
      );

      if (ownerResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid store owner",
        });
      }
    }

    const existingStore = await pool.query(
      "SELECT id FROM stores WHERE email = $1",
      [cleanEmail],
    );

    if (existingStore.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Store email is already registered",
      });
    }

    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id`,
      [cleanName, cleanEmail, cleanAddress, ownerId || null],
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store: result.rows[0],
    });
  } catch (error) {
    console.error("Create store error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create store",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      address = "",
      role = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const allowedSortFields = {
      name: "u.name",
      email: "u.email",
      address: "u.address",
      role: "u.role",
    };

    const sortColumn = allowedSortFields[sortBy] || "u.name";

    const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const values = [];
    const conditions = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`u.name ILIKE $${values.length}`);
    }

    if (email) {
      values.push(`%${email}%`);
      conditions.push(`u.email ILIKE $${values.length}`);
    }

    if (address) {
      values.push(`%${address}%`);
      conditions.push(`u.address ILIKE $${values.length}`);
    }

    if (role) {
      values.push(role);
      conditions.push(`u.role = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS rating
      FROM users u
      LEFT JOIN stores s
        ON s.owner_id = u.id
      LEFT JOIN ratings r
        ON r.store_id = s.id
      ${whereClause}
      GROUP BY u.id
      ORDER BY ${sortColumn} ${order}
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Get users error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS rating
      FROM users u
      LEFT JOIN stores s
        ON s.owner_id = u.id
      LEFT JOIN ratings r
        ON r.store_id = s.id
      WHERE u.id = $1
      GROUP BY u.id
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get user details error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load user details",
    });
  }
};

const getStores = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      address = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const allowedSortFields = {
      name: "s.name",
      email: "s.email",
      address: "s.address",
      rating: "average_rating",
    };

    const sortColumn = allowedSortFields[sortBy] || "s.name";

    const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const values = [];
    const conditions = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`s.name ILIKE $${values.length}`);
    }

    if (email) {
      values.push(`%${email}%`);
      conditions.push(`s.email ILIKE $${values.length}`);
    }

    if (address) {
      values.push(`%${address}%`);
      conditions.push(`s.address ILIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r
        ON r.store_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY ${sortColumn} ${order}
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      stores: result.rows,
    });
  } catch (error) {
    console.error("Get stores error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load stores",
    });
  }
};

module.exports = {
  getDashboard,
  createUser,
  createStore,
  getUsers,
  getUserById,
  getStores,
};
