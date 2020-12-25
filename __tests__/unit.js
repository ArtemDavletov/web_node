const owm = require("../controllers/owm_controller")

const london = {"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":3.68,"feels_like":-1.57,"temp_min":3.33,"temp_max":4,"pressure":1028,"humidity":75},"visibility":10000,"wind":{"speed":4.6,"deg":310},"clouds":{"all":90},"dt":1608855071,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1608883535,"sunset":1608911746},"timezone":0,"id":2643743,"name":"London","cod":200}

const preprocessedLondon = {
    temp: 3,
    name: "London",
    windSpeed: 	4.6,
    clouds: 90,
    pressure: 1028,
    humidity: 75,
    icon: "04n",
    lat: 51.51,
    lon: -0.13
}

const responseKeys = ["coord", "weather", "base", "main", "visibility", "wind", "clouds", "dt", "sys", "timezone", "id", "name", "cod"]

describe('Endpoint /weather', () => {
    
    it("Testing request 200", async () => {
        const result = await owm.request({"q": "London"})
        expect(Object.keys(result)).toStrictEqual(responseKeys);
    });

    it("Testing request 404", async () => {
        const result = await owm.request({"q": "ghkgkn"})
        expect(result).toStrictEqual({error: 404});
    });

    it("Testing process response", () => {
        const result = owm.processResponse(london);
        expect(result).toStrictEqual(preprocessedLondon);
    });
})