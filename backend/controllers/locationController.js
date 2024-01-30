const {getLatestLocation, getLocationAt} = require('../services/csv_reader')
const {validationResult} = require("express-validator");


async function getCurrentLocation(req, res) {
    try {
        const result = await getLatestLocation()
        console.log(result)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}


async function searchLocation(req, res) {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {date, time} = req.query

        if (date) {
            const results = await getLocationAt(date, time)
            res.status(200).json(results)

        } else if (!date) {
            const result = await getLatestLocation()
            res.status(200).json(result)
        }


    } catch (err) {
        res.status(500).send({message: err.message});
    }
}


module.exports = {
    getCurrentLocation,
    searchLocation
}
