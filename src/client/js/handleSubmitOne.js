import { geoNames,geoApiKey,weatherForecast, weatherHistory,weatherApiKey,pixaBay, pixaBayKey} from "./apiDetails";

const answerData = {};
const loaderDiv =  document.querySelector('#loaderSection');
const tripDetails = document.querySelector('#tripDetailsSection');
const websiteMain = document.querySelector('.mainBody');
const deleteTrip = document.querySelector("#remove");


function deleteFlight(event) {
    document.querySelector("#tripForm");
    tripDetails.classList.add("invisible");
    location.reload();
}




function performAction(e) {
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
        // Put loader here

        let loader = `<div class="loader"></div>`;

       loaderDiv.innerHTML = loader;
        // Fetching latitude and longitude of the entered destination
        getGeoLocation(answerData['whereTo'])
            .then((locationInfo) => {
                //Assigning the latitude and longitude fetched from JSON locationInfo
                const Lat = locationInfo.geonames[0].lat;
                const Long = locationInfo.geonames[0].lng;

                return grabWeatherData(Lat, Long, answerData['date']);
            })
            .then((weatherData) => {
                //Storing those temperature and weather condition in the answerData object we created in the beginning.
                answerData['temperature'] = weatherData['data'][0]['temp'];
                answerData['weather_condition'] = weatherData['data']['0']['weather']['description'];

                return grabImageData(answerData['whereTo']);
            })
            .then((imageInfo) => {
                if (imageInfo['hits'].length > 0) {
                    answerData['cityImage'] = imageInfo['hits'][0]['largeImageURL'];
                }
                //Sending answerData object to server to store info in projectData object in the backend.
                return postData(answerData);
            })
            .then((data) => {
            
                updateUI(data);
            })
    } catch (e) {
        console.log('error', e);
    }
}
//  Add Event Listener
deleteTrip.addEventListener("click", deleteFlight);

// Function to get GeoNames Api Data
const getGeoLocation = async (to) => {
    const response = await fetch(`${geoNames}${to}&maxRows=10&username=${geoApiKey}`);
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}


//Function to get weatherbit Api Data
const grabWeatherData = async (Lat, Long, date) => {

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

// Function to get info from Pixabay Api Data
const grabImageData = async (toCity) => {
    const response = await fetch(`${pixaBay}${pixaBayKey}&q=${toCity} city&image_type=photo`);
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

//  Function to post data in the backend
const postData = async (answerData) => {
    const response = await fetch('/addData', {
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
    loaderDiv.classList.replace('visible', 'invisible');
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

    weather.innerHTML = data.weather;
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
    performAction,
    deleteTrip,
    tripDetails
}