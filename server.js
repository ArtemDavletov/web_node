const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const weatherRoutes = require('./routes/weather')
const favoritesRoutes = require('./routes/favorites')

const PORT = process.env.PORT || 8000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))

app.use(weatherRoutes)
app.use(favoritesRoutes)

async function start() {
    try {
        await mongoose.connect('mongodb+srv://artem:3558266@cluster0.xnqzf.mongodb.net/weather', {
            useNewUrlParserL: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log('Server has been started');
        })
    } catch (e) {
        console.log(e)
    }
}

start()


