const express = require('express');
const router = express.Router();
const {getCurrentLocation} = require('../controllers/locationController')

/* GET current location. */
router.get('/', getCurrentLocation)

module.exports = router;
