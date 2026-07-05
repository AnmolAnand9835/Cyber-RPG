const auth = require('../middelware/auth');
const router = require('express').Router()

router.get('/', auth)

module.exports = router;