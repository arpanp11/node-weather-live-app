const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

var app = express();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var geocode = require('./geocode/geocode');
var weather = require('./weather/weather');

app.get('/', (req, res) => {
    res.render('index.hbs');
})

app.post('/', (req, res) => {
    var address = req.body.city;
    geocode.geocodeAddress(address, (errorMessage, results) => {
        if (errorMessage) {
            console.log(errorMessage);
        } else {
            weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
                if (errorMessage) {
                    console.log(errorMessage);
                }  else {
                    var weatherRes = `It's currently ${weatherResults.temperature} ${entities.decode('&#8457;')} in ${results.address}. It feels like ${weatherResults.apparentTemperature} ${entities.decode('&#8457;')}.`;
                    
                    res.render('index.hbs', {
                        weatherOutput: weatherRes,
                        currentYear: new Date().getFullYear()
                    });
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Connect to server .... ');
});
