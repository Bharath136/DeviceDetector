const express = require('express');
const { userRegistration, userLogin, getUserById, updateUserById, deleteUserById } = require('../controllers/user');
const { authenticate } = require('../middleware/middleware');
const router = express.Router();

const all = authenticate(['CUSTOMER', 'ADMIN'])

// Register a new user API
router.post('/register', userRegistration);

// Login a registered user API
router.post('/login', userLogin);

// Authorized user API with common CRUD operations
router.route("/:id")
    .get(getUserById)
    .put(updateUserById)
    .delete(deleteUserById);

module.exports = router;