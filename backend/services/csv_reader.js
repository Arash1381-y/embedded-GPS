const fs = require("fs")
const csv = require("fast-csv")


function getDataFromCsv() {
    const data = []
    let err = 0
    fs.createReadStream('./gps.csv')
        .pipe(csv.parse({headers: false}))
        .on('error', error => err = 1)
        .on('data', row => data.push(row))

    if (err === 1) return null
    return data
}


function getLatestLocation() {
    const data = getDataFromCsv()
    if (data === null) {
        throw Error('Malformed data set')
    }
    return data.slice(-1)
}


module.exports = {
    getLatestLocation
}