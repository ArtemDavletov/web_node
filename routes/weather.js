const {Router} = require('express')
const owm = require('../controllers/owm_controller')
const router = Router()

router.get('/', (req, res) => {
    res.sendStatus(200);
})

router.get('/weather', (req, res) => {
    owm.reply(req.query, res);
})


module.exports = router
