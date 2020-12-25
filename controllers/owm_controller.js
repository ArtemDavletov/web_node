const fetch = require("node-fetch");

function request(queryParams) {
    const base = 'https://api.openweathermap.org/data/2.5/weather';
    let params = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`);
    params.push('units=metric');
    params.push('appid=90ce88aa9b0fb76fbb80ec7191353a97');
    const url = base + '?' + params.join('&');
    return fetch(url).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return {error: 404};
        }
    }).catch(() => {
        return {error: 503};
    });
}

function processResponse(jsonResponse) {
    return {
        temp: Math.floor(jsonResponse.main.temp),
        name: jsonResponse.name,
        windSpeed: jsonResponse.wind.speed,
        clouds: jsonResponse.clouds.all,
        pressure: jsonResponse.main.pressure,
        humidity: jsonResponse.main.humidity,
        icon: jsonResponse.weather[0]['icon'],
        lat: jsonResponse.coord.lat,
        lon: jsonResponse.coord.lon
    }
}

function reply(query, res) {
    request(query).then((result) => {
        if (result.hasOwnProperty('error')) {
            res.sendStatus(result.error);
        } else {
            res.send(processResponse(result));
        }
    });
}

module.exports = { reply, request, processResponse };