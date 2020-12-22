const {Schema, model} = require('mongoose')

const schema = new Schema({
    temp: {
        type: Number
    },
    place: {
        type: String
    },
    windSpeed: {
        type: Number
    },
    clouds: {
        type: Number
    },
    pressure: {
        type: Number
    },
    humidity: {
        type: Number
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
})


module.exports = model('Favorites', schema)