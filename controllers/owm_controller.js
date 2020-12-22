const fetch = require("node-fetch");
// const fetch = require('isomorphic-fetch');

function fetchWithTimeout(resource, options) {
    const { timeout = 5000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

// function request(params) {
//     // const params = ['q=' + key]
//     params.push('units=metric');
//     params.push('appid=90ce88aa9b0fb76fbb80ec7191353a97');
//     const url = 'https://api.openweathermap.org/data/2.5/weather' + '?' + params.join('&');
//     return fetch(url).then((response) => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             return {error: 404};
//         }
//     }).catch(() => {
//         return {error: 503};
//     });
// }

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
        place: jsonResponse.name,
        windSpeed: jsonResponse.wind.speed,
        windDir: jsonResponse.wind.deg,
        clouds: jsonResponse.clouds.all,
        pressure: jsonResponse.main.pressure,
        humidity: jsonResponse.main.humidity,
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
