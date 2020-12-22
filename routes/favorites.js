const {Router} = require('express')
const owm = require('../controllers/owm_controller')
const Favorites = require('../db/mongo_controller')
const router = Router()

router.get('/', (req, res) => {
    res.render('server')
})

router.get('/favorites', async (req, res) => {
    const favorites = await Favorites.find({})
    res.send(favorites);
})

router.post('/favorites', async (req, res) => {
    const array = await Favorites.find({place: req.body.name})

    if (array.length !== 0) {
        res.sendStatus(500);
    }

    const result = await owm.request({'q': req.body.name}, res)

    if (result.hasOwnProperty('error')) {
        res.sendStatus(result.error);
    } else {
        const favorite = new Favorites(owm.processResponse(result))
        await favorite.save()
        res.send(favorite);
    }
})

router.delete('/favorites', async (req, res) => {
    await Favorites.deleteOne({place: req.body.name})
    res.sendStatus(200);
})

module.exports = router
