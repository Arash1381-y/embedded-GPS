const express = require('express');
const router = express.Router();
const {getCurrentLocation} = require('../controllers/locationController')


/* GET current location. */
router.get('/', getCurrentLocation)


router.get('/search', )

module.exports = router;
