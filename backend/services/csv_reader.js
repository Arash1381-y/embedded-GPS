const fs = require("fs")
const csv = require("fast-csv")


async function getDataFromCsv() {
    return new Promise(function (resolve, reject) {
        let data = []
        fs.createReadStream('./../gps.csv')
            .pipe(csv.parse({headers: false, delimiter: ','}))
            .on('error', error => reject())
            .on('data', row => {
                data.push(row)
            })
            .on('end', () => {
                resolve(data)
            })
    })
}


async function getLatestLocation() {
    const data = await getDataFromCsv()
    if (data === null) {
        throw Error('Malformed data set')
    }
    return data[data.length - 1]
}


module.exports = {
    getLatestLocation
}
