// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Require bodyParser dependency
const bodyParser = require('body-parser');

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
app.use(express.static('website'));

// Setup Server
const port = 3030;
const server = app.listen(port,listening);

// Listening function
function listening() {
    console.log(`Running on port: ${port}`);
}

// GET route setup to return the JS object created projectData
app.get('/all', getData);

function getData(req,res){
    res.send(projectData);
}

// POST route setup to add an entry to the project endpoint

const data = [];

app.post('/addData', addData);

function addData(req, res){
    let newData = req.body;

    projectData['date'] = newData.date;
    projectData['temp'] = newData.temp;
    projectData['content'] = newData.content;

    res.send(projectData);
}