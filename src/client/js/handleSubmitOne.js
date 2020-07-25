const answerData = {};

// Base URLs and API keys for GeoNames, Weatherbit and Pixabay URLs
//  GeoNames
const geoNames = 'http://api.geonames.org/searchJSON?q=';
const geoApiKey = 'sammieyisau';
//  Weatherbit
const weatherForecast = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherHistory = 'https://api.weatherbit.io/v2.0/history/daily?lat=';
const weatherApiKey = '26ce153221364218b08d75d11be68644';
//  Pixabay
const pixaBay = 'https://pixabay.com/api/?key=';
const pixaBayKey = '16471602-8e4cf128d083ab992b7ab8332';

const tripDetails = document.querySelector('#tripDetailsSection');
const websiteMain = document.querySelector('.mainBody');



function handleSubmitOne(e) {
    //  To prevent the page from getting refreshed when the submit button is clicked on
    e.preventDefault(); 

    // Get user input values
    answerData['whereFrom'] = document.querySelector('#whereFrom').value;
    answerData['whereTo'] = document.querySelector('#whereTo').value;
    answerData['date'] = document.querySelector('#departureDate').value;
    answerData['returnDate'] = document.querySelector('#returnDate').value;
    
    //  Add some additional keys that we would be using later on
    answerData['daystogo'] = dateDiffInDays(answerData['date']);
    answerData['daysaway'] = amountOfDaysOnTrip(answerData['returnDate'], answerData['date']);

    try {
        // Fetching geographic information of the entered destination
        grabGeoData(answerData['whereTo'])
            .then((toInfo) => {
                //Assigning the data fetched from JSON toInfo
                const Lat = toInfo.geonames[0].lat;
                const Long = toInfo.geonames[0].lng;

                //Getting Weather answerData from the geographic information fetched
                return grabWeatherData(Lat, Long, answerData['date']);
            })
            .then((weatherData) => {
                //Storing those weather answerData in the object we created in the beginning
                answerData['temperature'] = weatherData['data'][0]['temp'];
                answerData['weather_condition'] = weatherData['data']['0']['weather']['description'];

                //Calling Pixabay API to fetch the first img of the city that it can find
                return grabImageData(answerData['whereTo']);
            })
            .then((imageInfo) => {
                if (imageInfo['hits'].length > 0) {
                    answerData['cityImage'] = imageInfo['hits'][0]['webformatURL'];
                }
                //Sending data to server to store the answerData in the backend.
                return postData(answerData);
            })
            .then((data) => {
                //Receiving the data from server and updating the UI
                updateUI(data);
            })
    } catch (e) {
        console.log('error', e);
    }
}

// Function to get GeoNames Api Data
async function grabGeoData(to) {
    const response = await fetch(`${geoNames}${to}&maxRows=10&username=${geoApiKey}`);
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}


//Function to get weatherbit Api Data
async function grabWeatherData(Lat, Long, date) {

    // Getting the timestamp for the current date and traveling date for upcoming processing.
    const tripDate = Math.floor(new Date(date).getTime() / 1000);
    const dateAsAtToday = new Date();
    const todayDateStamp = Math.floor(new Date(dateAsAtToday.getFullYear() + '-' + dateAsAtToday.getMonth() + '-' + dateAsAtToday.getDate()).getTime() / 1000);

    let response;
    // Check if the date is gone, and proceed with next date.
    if (tripDate < todayDateStamp) {
        let nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        response = await fetch(`${weatherHistory}${Lat}&lon=${Long}&start_date=${date}end_date=${nextDate}&key=${weatherbitkey}`)
    } else {
        response = await fetch(`${weatherForecast}${Lat}&lon=${Long}&key=${weatherApiKey}`);
    }

    try {
        return await response.json();
    } catch (e) {
        console.log('error', e)
    }
}

// Function to get Pixabay Api Data
async function grabImageData(toCity) {
    const response = await fetch(`${pixaBay}${pixaBayKey}&q=${toCity} city&image_type=photo`);
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

//  Function to post data
async function postData(answerData) {
    const response = await fetch('http://localhost:3030/addData', {
        method: "POST",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(answerData)
    });

    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

// Function to update UI
function updateUI(data) {
    tripDetails.classList.remove('invisible');
    tripDetails.scrollIntoView({behavior: "smooth"});

    let destinationanswerData = document.querySelector("#destination");
    let boardinganswerData = document.querySelector("#boarding");
    let departureDate = document.querySelector("#departingDate");
    let numberOfDays = document.querySelector('#numberOfDays');
    let numberOfDaysOnTrip = document.querySelector('#daysAwayOnTrip');
    let temperature = document.querySelector('#temperature');
    let destinationPhoto = document.querySelector('#destinationPhoto');
    let weather = document.querySelector('#weather');

    destinationanswerData.innerHTML = data.to;
    boardinganswerData.innerText = data.from;
    departureDate.innerHTML = data.date;

    if (data.daystogo < 0) {
        document.querySelector('#daystogo').innerHTML = 'Seems like you have missed your flight!';
    } else {
        numberOfDays.innerHTML = data.daystogo;
    }

    if(data.daysaway < 0 ) {
        document.querySelector("#daysaway").innerHTML = 'There must be some sort of error. Try again!';
    } else {
        numberOfDaysOnTrip.innerHTML = data.daysaway;
    }

    temperature.innerHTML = data.temperature + '&#8451;';
    if (data.cityImage !== undefined) {
        destinationPhoto.setAttribute('src', data.cityImage);
    }

    weather.innerHTML = data.weather_condition;
}

let dateDiffInDays = function (date1) {
    let dt1 = new Date(date1);
    let dt2 = new Date();
    return Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())) / (1000 * 60 * 60 * 24));

};

let amountOfDaysOnTrip = function (date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2)

    return Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())) / (1000 * 60 * 60 * 24));
    
}

export {
    websiteMain,
    handleSubmitOne,
    tripDetails
}