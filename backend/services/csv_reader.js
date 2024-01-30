const fs = require("fs")
const csv = require("fast-csv")


async function getDataFromCsv() {
    return new Promise(function (resolve, reject) {
        let data = []
        fs.createReadStream('./../gps.csv')
            .pipe(csv.parse({headers: false, delimiter: ","}))
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


    const time = data[data.length - 1][0]
    const lat = data[data.length - 1][1]
    const lon = data[data.length - 1][2]
    console.log(time, lat, lon)
    return {time: time, lat: lat, lon: lon}
}


const parseISOTime = (isoTime) => {
    // Assuming isoTime is in the format YYYY-MM-DDTHH:mm:ss
    const parsedDate = new Date(isoTime);
    return {
        date: parsedDate.toISOString().split('T')[0],
        time: parsedDate.toISOString().split('T')[1].split('.')[0].slice(0, 5) // Exclude seconds
    };
};

async function getLocationAt(date, time) {

    const data = await getDataFromCsv()
    if (data === null) {
        throw Error('Malformed data set')
    }

    let results = [];
    for (let i = 0; i < data.length; i++) {
        const {isoTime, lat, lon} = data[i]
        const parsedTime = parseISOTime(isoTime);

        // Compare parsedTime with input date and time
        if (parsedTime.date === date && (parsedTime.time === time || !time)) {
            // Match found, return location data or do something with it
            results.push({time: parsedTime.time, lat: lat, lone: lon});
        }
    }
    return results;
}


module.exports = {
    getLatestLocation,
    getLocationAt
}
