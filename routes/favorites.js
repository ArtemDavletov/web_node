const {Router} = require('express')
const owm = require('../controllers/owm_controller')
const Favorites = require('../db/mongo_controller')
const router = Router()


router.get('/', (req, res) => {
    res.sendStatus(200);
})

router.get('/favorites', async (req, res) => {
    try {
        const favorites = await Favorites.find({})
        res.send(favorites);
    } catch {
        res.sendStatus(500);
    }

})

router.post('/favorites', async (req, res) => {
    try {
        const array = await Favorites.find({name: req.body.name})

        if (array.length !== 0) {
            res.sendStatus(400);
        } else {

            owm.request({'q': req.body.name}).then(async (result) => {
                if (result.hasOwnProperty('error')) {
                    res.sendStatus(result.error);
                } else {
                    const favorite = new Favorites({name: req.body.name})
                    await favorite.save()
                    res.send(owm.processResponse(result));
                }
            });
        }

    } catch {
        res.sendStatus(500);
    }

})

router.delete('/favorites', async (req, res) => {
    try{
        await Favorites.deleteOne({name: req.body.name})
        res.sendStatus(200);
    } catch {
        res.sendStatus(500);
    }

})

module.exports = router