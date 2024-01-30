const {query} = require('express-validator');


const searchLocationMiddlewares = [
    query('date').escape().isDate().withMessage("invalid date field"),
    query('time').escape().isTime({hourFormat: "hour24"}).withMessage("invalid time field")
]


module.exports = {
    searchLocationMiddlewares
}