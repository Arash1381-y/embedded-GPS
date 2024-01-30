const {getLatestLocation} = require('../services/csv_reader')


async function getCurrentLocation(req, res) {
    try {
        const result = await getLatestLocation()
        res.status(200).json({lat: result[0], lon: result[1], time: result[2]})
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}


module.exports = {
    getCurrentLocation
}
