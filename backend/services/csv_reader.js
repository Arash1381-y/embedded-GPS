const fs = require("fs")
const csv = require("fast-csv")

const dotenv = require('dotenv');
dotenv.config({path: "../.env.backend"});


async function getDataFromCsv() {
    return new Promise(function (resolve, reject) {
        let data = []
        fs.createReadStream(process.env.DATA_FILE)
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


    const [time, lat, lon] = data[data.length - 1]
    return {time: time, lat: lat, lon: lon}
}


const parseISOTime = (isoTime) => {
    // Assuming isoTime is in the format YYYY-MM-DDTHH:mm:ss.SSSSSS
    const parsedDate = new Date(isoTime);

    const formattedTime = `${parsedDate.getHours()}:${parsedDate.getMinutes()}`;

    console.log(formattedTime)

    return {
        date: parsedDate.toISOString().split('T')[0],
        time: formattedTime
    };
};

async function getLocationAt(date, time) {

    const data = await getDataFromCsv()
    if (data === null) {
        throw Error('Malformed data set')
    }

    let results = [];
    for (let i = 0; i < data.length; i++) {
        const [isoTime, lat, lon] = data[i]
        const parsedTime = parseISOTime(isoTime);

        // Compare parsedTime with input date and time
        if (parsedTime.date === date && (parsedTime.time === time || !time)) {
            // Match found, return location data or do something with it
            results.push({time: parsedTime.time, lat: lat, lone: lon});
        }
    }
    // return 10 latest data
    return results.slice(results.length - 10, results.length)
}


module.exports = {
    getLatestLocation,
    getLocationAt
}
