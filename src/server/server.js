// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Require bodyParser dependency
const bodyParser = require('body-parser');

// Require path dependency
const path = require('path');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = process.env.PORT || 3030;

const server = app.listen(port,listening);

// Listening function
function listening() {
    console.log(`Running on port: ${port}`);
}

// GET route setup to return the JS object created projectData
app.get('/', getData);

function getData(req,res){
    res.status(200).sendFile(path.join(__dirname + './client/views/index.html'));
}

// POST route setup to add an entry to the project endpoint

app.post('/addData', addData);

function addData(req, res){
    let newData = req.body;

    projectData['to'] = newData.whereTo;
    projectData['from'] = newData.whereFrom;
    projectData['temperature'] = newData.temperature;
    projectData['weather'] = newData.weather_condition;
    projectData['daystogo'] = newData.daystogo;
    projectData['daysaway'] = newData.daysaway;
    projectData['cityImage'] = newData.cityImage;
    projectData['date'] = newData.date;
    
    
    

    res.send(projectData);
}