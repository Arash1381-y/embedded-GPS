const express = require('express');
const router = express.Router();
const {getCurrentLocation, searchLocation} = require('../controllers/locationController')


/* GET current location. */
router.get('/', getCurrentLocation)


router.get('/search', searchLocation)

module.exports = router;
