const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const corsOptions ={
	    origin:'*', 
	    credentials:true,            //access-control-allow-credentials:true
	    optionSuccessStatus:200
	    }

const locationRouter = require('./routes/location');

const app = express();


// use all these middleware for all routes
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	    next();
});


app.use("/location", locationRouter)




module.exports = app;



