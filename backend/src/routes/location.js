const express = require('express');
const { authenticate } = require('../middleware/middleware')
const { detectDevice } = require('../controllers/location');
const router = express.Router();

router.post('/detect_device', detectDevice)


module.exports = router