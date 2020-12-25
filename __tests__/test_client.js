const chai = require('chai');
// const jest = require('jest');
const chai_http = require('chai-http');
chai.use(chai_http);
const expect = require('chai').expect;
const mocha = require('mocha');
const sinon = require('sinon');
const afterEach = mocha.afterEach;
const beforeEach = mocha.beforeEach;
require('sinon-mongo');
const fetch = require('isomorphic-fetch');
const fetchMock = require('fetch-mock');
// const describe = mocha.describe;
// const it = mocha.it;
chai.should();
const JSDOM = require('jsdom').JSDOM;
global.windDirection = require('../client').split;
// import { it, before, describe } from 'jest';

const localhost = 'http://localhost:8000';

const html = `<head>
    <meta charset="UTF-8">
    <title>Weather</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
<header></header>
<main>
    <section class="currentCity">
        <div class="currentCityHeader">
            <h1>Погода здесь</h1>
            <form method="get" name="refresh">
                <input type="submit" value="Обновить геолокацию">
                <botton></botton>
            </form>
        </div>

        <div class="currentCityBody">
            <template id="currentCity">
                <div class="currentCityBodyInfo">
                    <h3 class="currentCityName"></h3>
                    <p class="currentCityTemperature"></p>
                    <img class="currentCityPicture">
                </div>

                <ul class="currentCityItems">
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Ветер</p>
                        <p class="cityItemPointValue"></p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Облачность</p>
                        <p class="cityItemPointValue"></p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Давление</p>
                        <p class="cityItemPointValue"></p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Влажность</p>
                        <p class="cityItemPointValue"></p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Координаты</p>
                        <p class="cityItemPointValue"></p>
                    </li>
                </ul>
            </template>
        </div>
    </section>

    <section class="favourites">
        <div class="favouritesHeader">
            <h2>Избранное</h2>
            <form method="get" name="addFavorite">
                <input required type="text" id="addFavorite" name="addFavorite" placeholder="Добавить новый город">
                <input type="submit" value="+" class="addFavorite">
            </form>
        </div>


        <ul class="favouritesCities">
            <template id="favourites">
                <li class="favouriteCity">
                    <div class="favouriteCityHeader">
                        <h3 class="favouriteCityName"></h3>
                        <p class="favouriteCityTemperature"></p>
                        <img class="favouriteCityPicture">
                        <button class="close" onclick="removeCity(this.id);">×</button>
                    </div>

                    <ul class="cityItems">
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Ветер</p>
                            <p class="cityItemPointValue"></p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Облачность</p>
                            <p class="cityItemPointValue"></p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Давление</p>
                            <p class="cityItemPointValue"></p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Влажность</p>
                            <p class="cityItemPointValue"></p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Координаты</p>
                            <p class="cityItemPointValue"></p>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>
    </section>
</main>
<script src="../client.js"></script>
</body>`;

const lisiyNosResponse = {
    temp: 0,
    place: 'Lisiy Nos',
    windSpeed: 5.0,
    windDir: 127,
    clouds: 95,
    pressure: 1013,
    humidity: 65,
    lat: 60.,
    lon: 30.
};

const moscowResponse = {
    temp: 0,
    place: 'Moscow',
    windSpeed: 5.0,
    windDir: 127,
    clouds: 95,
    pressure: 1013,
    humidity: 65,
    lat: 60.,
    lon: 30.
};


const moscowF = `<li class="favouriteCity">
                    <div class="favouriteCityHeader">
                        <h3 class="favouriteCityName">Moscow</h3>
                        <p class="favouriteCityTemperature">-3°C</p>
                        <img class="favouriteCityPicture" src="https://openweathermap.org/img/wn/13d@2x.png">
                        <button class="close" onclick="removeCity(this.id);" id="Moscow">×</button>
                    </div>

                    <ul class="cityItems">
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Ветер</p>
                            <p class="cityItemPointValue">5 m/s</p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Облачность</p>
                            <p class="cityItemPointValue">90 %</p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Давление</p>
                            <p class="cityItemPointValue">1006 hpa</p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Влажность</p>
                            <p class="cityItemPointValue">92 %</p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Координаты</p>
                            <p class="cityItemPointValue">[55.75, 37.62]</p>
                        </li>
                    </ul>
                </li>`

const moscowCurr = `<div class="currentCityBodyInfo">
                    <h3 class="currentCityName">Moscow</h3>
                    <p class="currentCityTemperature">-3°C</p>
                    <img class="currentCityPicture" src="https://openweathermap.org/img/wn/13d@2x.png">
                </div><ul class="currentCityItems">
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Ветер</p>
                        <p class="cityItemPointValue">5 m/s</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Облачность</p>
                        <p class="cityItemPointValue">90 %</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Давление</p>
                        <p class="cityItemPointValue">1006 hpa</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Влажность</p>
                        <p class="cityItemPointValue">92 %</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Координаты</p>
                        <p class="cityItemPointValue">[55.75, 37.62]</p>
                    </li>
                </ul>`

const cityLoader = `<div class="lds-spinner"></div>`;

const responseKeys = ["temp", "name", "windSpeed", "clouds", "pressure", "humidity", "icon", "lat", "lon"]

window = new JSDOM(html).window;
document = window.document;
let client = require('../client');
global.window = window;
window.alert = sinon.spy();
global.document = window.document;
global.navigator = {
    userAgent: 'node.js'
};
global.fetch = fetch;
global.alert = window.alert;
global.FormData = window.FormData;

const geolocate = require('mock-geolocation');
geolocate.use();
client.init();

describe('Testing client', () => {

    it("Testing filling current city", async (done) => {
        const params = await client.request(['q=Moscow'])
        console.log(params)
        const result = await client.fillCurrentCityTemplate(params)
        console.log(result)
        expect(moscowCurr).to.be.eql(result);
        done();
    });

    it("Testing adding favorite city", async (done) => {
        const params = await client.request(['q=Moscow'])
        console.log(params)
        const result = await client.appendCityTemplate(params)
        console.log(result)
        expect(moscowF).to.be.eql(result);
        done();
    });

    it("Testing correct request by name", async (done) => {
        const result = await client.request(["q=London"])
        expect(Object.keys(result)).to.be.eql(responseKeys);
        done();
    });

    it("Testing correct request by coords", async (done) => {
        const result = await client.request(["lat=59.936003295525815", "lon=30.237438323552727"])
        expect(Object.keys(result)).to.be.eql(responseKeys);
        done();
    });
})

