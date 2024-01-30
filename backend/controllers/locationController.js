const {getLatestLocation} = require('../services/csv_reader')


async function getCurrentLocation(req, res) {
    try {
        const result = await getLatestLocation()
        res.status(200).json({time: result[0], lat: result[1], lon: result[2]})
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}


module.exports = {
    getCurrentLocation
}
