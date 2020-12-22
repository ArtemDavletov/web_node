const {Router} = require('express')
const owm = require('../controllers/owm_controller')
const router = Router()

router.get('/', (req, res) => {
    res.render('server')
})

router.get('/weather', (req, res) => {
    owm.reply(req.query, res);

    // if (result.hasOwnProperty('error')) {
    //     res.sendStatus(result.error);
    // } else {
    //     res.send(owm.processResponse(result));
    // }
})


module.exports = router
