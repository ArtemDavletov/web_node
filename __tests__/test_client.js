const JSDOM = require('jsdom').JSDOM;
const sinon = require('sinon');

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

const currCityBody = `<div class="currentCityBody"><div class="currentCityBodyInfo">
                    <h3 class="currentCityName">Saint Petersburg</h3>
                    <p class="currentCityTemperature">0.26°C</p>
                    <img class="currentCityPicture" src="https://openweathermap.org/img/wn/13n@2x.png">
                </div><ul class="currentCityItems">
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Ветер</p>
                        <p class="cityItemPointValue">4 m/s</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Облачность</p>
                        <p class="cityItemPointValue">75 %</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Давление</p>
                        <p class="cityItemPointValue">1002 hpa</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Влажность</p>
                        <p class="cityItemPointValue">98 %</p>
                    </li>
                    <li class="cityItemPoint">
                        <p class="cityItemPointName">Координаты</p>
                        <p class="cityItemPointValue">[59.94, 30.24]</p>
                    </li>
                </ul></div>`

const moscow = `<li class="favouriteCity" id="Moscow"><li class="favouriteCity">
                    <div class="favouriteCityHeader">
                        <h3 class="favouriteCityName">Moscow</h3>
                        <p class="favouriteCityTemperature">-2.15°C</p>
                        <img class="favouriteCityPicture" src="https://openweathermap.org/img/wn/13n@2x.png">
                        <button class="close" onclick="removeCity(this.id);" id="Moscow">×</button>
                    </div>

                    <ul class="cityItems">
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Ветер</p>
                            <p class="cityItemPointValue">4 m/s</p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Облачность</p>
                            <p class="cityItemPointValue">90 %</p>
                        </li>
                        <li class="cityItemPoint">
                            <p class="cityItemPointName">Давление</p>
                            <p class="cityItemPointValue">1007 hpa</p>
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
                </li></li>`

const responseKeys = ["coord", "weather", "base", "main", "visibility", "wind", "clouds", "dt", "sys", "timezone", "id", "name", "cod"]

window = new JSDOM(html).window;
document = window.document;
let client = require('../client');
global.window = window;
window.alert = sinon.spy();
global.document = window.document;
global.navigator = {
    userAgent: 'node.js'
};
global.alert = window.alert;
global.FormData = window.FormData;
const geolocate = require('mock-geolocation');
geolocate.use();
client.init();


// describe('Testing client', () => {
//
//     it("Testing request", (done) => {
//         const result = client.request(["q=London"])
//         expect(Object.keys(result)).toStrictEqual(responseKeys);
//     });
//
// });