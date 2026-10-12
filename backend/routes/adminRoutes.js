const express = require('express');

const {
  getDashboard,
  createUser,
  createStore,
  getUsers,
  getStores,
  getUserById
} = require('../controllers/adminController');

const {
  authenticate,
  authorize
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/dashboard',
  authenticate,
  authorize('admin'),
  getDashboard
);

router.post(
  '/users',
  authenticate,
  authorize('admin'),
  createUser
);

router.get(
  '/users',
  authenticate,
  authorize('admin'),
  getUsers
);

router.get(
  '/users/:id',
  authenticate,
  authorize('admin'),
  getUserById
);

router.post(
  '/stores',
  authenticate,
  authorize('admin'),
  createStore
);

router.get(
  '/stores',
  authenticate,
  authorize('admin'),
  getStores
);

module.exports = router;