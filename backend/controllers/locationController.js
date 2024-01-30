const {getLatestLocation} = require('../services/csv_reader')


function getCurrentLocation(req, res) {
    try {
        const result = getLatestLocation()
        res.status(200).send({lat: result[0], lon: result[1], time: result[2]})
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}


module.exports = {
    getCurrentLocation
}