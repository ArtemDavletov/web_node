const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')

const exphbs = require('express-handlebars')
const weatherRoutes = require('./routes/weather')
const favoritesRoutes = require('./routes/favorites')
const cors = require('cors');


const PORT = process.env.PORT || 8000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));

app.use(weatherRoutes)
app.use(favoritesRoutes)

async function start() {
    try {
        await mongoose.connect('mongodb+srv://artem:3558266@cluster0.xnqzf.mongodb.net/weather', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log('Server has been started');
        })
    } catch (e) {
        console.log(e)
    }
}


start()