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

//array to store all the weather cards
const weatherCards = [];

app.get("/", (req, res) => {
    res.render("index")
});

//user searches for the city weather
app.post("/", (req, res) => {
    const endpoint = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = "07b4338e7bd390d62cd3a1aeb04c3366";
    const units = "imperial";
    const location = req.body.weatherSearch;
    const query = endpoint+"?q="+location+"&appid="+apiKey+"&units="+units;

    https.get(query, (response) => {
        console.log(res.statusCode);

        res.on("data", (data) => {
            const weatherData = JSON.parse(data);
            weatherDataFiltered = {
                cityName: weatherData.name,
                temperature: weatherData.main.temp,
                tempMax: weatherData.main.temp_max,
                tempMin: weatherData.main.temp_min,
                weather: weatherData.weather[0].main,
                weatherDescription: weatherData.weather[0].description,
                windSpeed: weatherData.wind.speed
            };

            console.log(weatherDataFiltered);
            weatherCards.push(weatherDataFiltered);
            
        });
    });

    res.redirect("/weather");
});

app.get("/weather", (req, res) => {
    res.render("weather", {cityName: weatherCards[0].cityName});
});

app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});

//API Key
//07b4338e7bd390d62cd3a1aeb04c3366

