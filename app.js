const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const { redirect } = require("express/lib/response");

const app = express();

//setting ejs as view engine
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let searchCityName = "";
let temperature = "";
let weatherDescription = "";
let temperatureMax = "";
let temperatureMin = "";
let windSpeed = "";
let status = "";

app.get("/", (req, res) => {
    res.render("index", {cityName: searchCityName, 
                        status: status, 
                        temperature: temperature, 
                        weatherDescription: weatherDescription,
                        temperatureMax: temperatureMax,
                        temperatureMin: temperatureMin,
                        windSpeed: windSpeed});
});

//user searches for the city weather
app.post("/", (req, res) => {
    const endpoint = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = "07b4338e7bd390d62cd3a1aeb04c3366";
    const units = "imperial";
    const location = req.body.weatherSearch;
    const query = endpoint+"?q="+location+"&appid="+apiKey+"&units="+units;

    https.get(query, (response) => {
        console.log(response.statusCode);

        if(response.statusCode === 200){
            response.on("data", (data) => {
                const weatherData = JSON.parse(data);
                const weatherDataFiltered = {
                    cityName: weatherData.name,
                    temperature: weatherData.main.temp,
                    tempMax: weatherData.main.temp_max,
                    tempMin: weatherData.main.temp_min,
                    weather: weatherData.weather[0].main,
                    weatherDescription: weatherData.weather[0].description,
                    windSpeed: weatherData.wind.speed
                };
    
                console.log(weatherDataFiltered);
                searchCityName = weatherDataFiltered.cityName;
                temperature = Math.floor(weatherDataFiltered.temperature) + " °F";
                weatherDescription = weatherDataFiltered.weatherDescription;
                temperatureMax = "H: " + Math.floor(weatherDataFiltered.tempMax) + " °F";
                temperatureMin = "L: " + Math.floor(weatherDataFiltered.tempMin) + " °F";
                windSpeed = Math.floor(weatherDataFiltered.windSpeed) + " mph";
                status = "";
                res.redirect("/");
            });            
        }
        //if invalid city is given
        else {
            status = "Invalid city name, please try again.";
            res.redirect("/");
        }
    });
});

// how it works page
app.get("/how-it-works", (req, res) => {
    res.render("how-it-works");
});

app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});

//API Key
//07b4338e7bd390d62cd3a1aeb04c3366

