# Udacity FEND Capstone - Travel App

## What The Project Entails
This project requires you to build out a travel app that, at a minimum, obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs. Given that this is the Capstone project, it's highly encouraged for you to go above and beyond, adding additional functionality and customization to truly stand out with a project you are proud to have at the top of your portfolio!

## Run project
Below shows how to run in development and production mode.
### run in development mode
To start the webpack dev server at port 8080

` $ npm run build-dev`

### run in production mode
Generate the dist files and then start server at port 3030

` $ npm run build-prod`

` $ npm run start`

## Configs
Here, we have two webpack config files for both development mode(`webpack.config.dev.js`) and production mode(`webpack.config.prod.js` )

We also have a `package.json` to manage dependencies.

## Offline Functionality
The project have service workers set up in webpack to provide the offline functionality of our app. When the service worker is functioning correctly, you will see the below message when you inspect the browser.


## Testing

Testing is done with Jest. To run test, use the command 

`npm run test`. 
