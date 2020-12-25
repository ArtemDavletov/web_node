const SPINNER = `<div class="lds-spinner">
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                 </div>`;

let refreshForm = document.forms.namedItem('refresh');
let addCityForm = document.forms.namedItem('addFavorite');

refreshForm.addEventListener('submit', (event) => {
    getLocation();
    event.preventDefault();
});

addCityForm.addEventListener('submit', (event) => {
    addNewCity(event.target);
    event.preventDefault();
});

function split(cityName) {
    return cityName.split(' ').join('-');
}

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

function request(params) {
    const base = 'http://localhost:8000/weather/';
    const url = base + '?' + params.join('&');
    console.log(url)
    return fetch(url).then((response) => {
        if (response.ok) {
            return response.json();
        } else if(response.status === 404) {
            alert('No such city with name ' + params[0].substr(2));
        } else {
            alert('Something went wrong');
        }
    }).catch(() => {
        alert('Your connection was lost, sorry.');
    });
}

function getLocation() {
    fillCurrentCityLoader();
    let currentLocation = navigator.geolocation;
    if (currentLocation) {
        currentLocation.getCurrentPosition(
            (position) => {
                fillCurrentCity([`lat=${position.coords.latitude}`, `lon=${position.coords.longitude}`]);
            },
            (error) => {
                fillCurrentCity(['q=Saint Petersburg']);
            }
        );
        return;
    }
    fillCurrentCity(['q=Saint Petersburg']);
}

function addSavedCities() {
    return fetch('http://localhost:8000/favorites').then((res) => {
        if (res.ok) {
            return res.json()
        }
    }).then((res) => {
        console.log(res)
        for (let i = 0; i < res.length; i++) {
            const newCity = appendCityLoader();
            const key = res[i];
            request(['q=' + key.name]).then((jsonResult) => {
                console.log(key.name, jsonResult)
                appendCity(jsonResult, newCity);
            });
        }
    });
}

function addNewCity(target) {
    const value = target.addFavorite.value.replace(/\'/g, "\"").replace(/\"/g, '\\"');
    const cityName = value.toLowerCase();
    const newCity = appendCityLoader();
    addCityForm.reset();
    return request(['q=' + cityName]).then((jsonResult) => {
        return fetch('http://localhost:8000/favorites', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: jsonResult.name
            })
        }).then((response) => {
            if (response.status === 200) {
                appendCity(jsonResult, newCity);
            } else if (response.status === 400) {
                newCity.remove();
                alert('City exists in favorites');
            } else if (response.status === 404) {
                newCity.remove();
                alert('No such city with name ' + jsonResult.name);
            } else {
                newCity.remove();
                alert('Something going wrong');
            }
        }).catch(() => {
            newCity.remove();
            alert('Connection was lost');
        })
    }).catch(() => {
        newCity.remove();
    });
}

function removeCity(cityName) {
    fetch('http://localhost:8000/favorites', {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: cityName,
        })
    });
    document.getElementById(split(cityName)).remove();
}

function fillCurrentCityLoader() {
    document.getElementsByClassName('currentCityBody')[0].insertAdjacentHTML('beforebegin', SPINNER);
}

function fillCurrentCity(queryParams) {
    request(queryParams).then((jsonResult) => {
        document.querySelector(`.lds-spinner`).remove();
        document.getElementsByClassName('currentCityBody')[0].innerHTML = fillCurrentCityTemplate(jsonResult);
    });
}

function appendCityLoader() {
    let newCity = document.createElement('li');
    newCity.className = 'favouriteCity';
    newCity.innerHTML = SPINNER;
    document.getElementsByClassName('favouritesCities')[0].appendChild(newCity);
    return newCity;
}

function appendCity(jsonResult, newCity) {
    const cityName = jsonResult.name;
    newCity.id = split(cityName);
    newCity.innerHTML = appendCityTemplate(jsonResult);
}

function fillCurrentCityTemplate (params) {
    let currentItemElement = document.querySelector(`#currentCity`).content.cloneNode(true).querySelector(`.currentCityBodyInfo`);
    let currentCityItemsElement = document.querySelector(`#currentCity`).content.cloneNode(true).querySelector(`.currentCityItems`);

    currentItemElement.querySelector(`.currentCityName`).textContent = `${params.name}`;
    currentItemElement.querySelector(`.currentCityTemperature`).textContent = `${params.temp}°C`;
    currentItemElement.querySelector(`.currentCityPicture`).src = `https://openweathermap.org/img/wn/${params.icon}@2x.png`;

    currentCityItemsElement = fillCurrentCityUlTemplate(currentCityItemsElement, params);

    return currentItemElement.outerHTML + currentCityItemsElement.outerHTML;
}

function appendCityTemplate (params) {
    let favoriteItemElement = document.querySelector(`#favourites`).content.cloneNode(true).querySelector(`.favouriteCity`);

    favoriteItemElement.querySelector(`.favouriteCityName`).textContent = `${params.name}`;
    favoriteItemElement.querySelector(`.favouriteCityTemperature`).textContent = `${params.temp}°C`;
    favoriteItemElement.querySelector(`.favouriteCityPicture`).src = `https://openweathermap.org/img/wn/${params.icon}@2x.png`;
    favoriteItemElement.querySelector(`.close`).id = `${params.name}`;
    favoriteItemElement = fillCurrentCityUlTemplate(favoriteItemElement, params);

    return favoriteItemElement.outerHTML;
}

function fillCurrentCityUlTemplate(favoriteItemElement, params) {
    const detailsElements = favoriteItemElement.querySelectorAll(`.cityItemPoint`);

    detailsElements[0].querySelector(`.cityItemPointValue`).textContent = `${params.windSpeed} m/s`;
    detailsElements[1].querySelector(`.cityItemPointValue`).textContent = `${params.clouds} %`;
    detailsElements[2].querySelector(`.cityItemPointValue`).textContent = `${params.pressure} hpa`;
    detailsElements[3].querySelector(`.cityItemPointValue`).textContent = `${params.humidity} %`;
    detailsElements[4].querySelector(`.cityItemPointValue`).textContent = `[${params.lat}, ${params.lon}]`;

    return favoriteItemElement;
}

getLocation();
addSavedCities();

module.exports = {
    getLocation, fillCurrentCityTemplate, appendCityTemplate, request, init
}