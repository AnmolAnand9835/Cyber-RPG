const auth = require('../controllers/auth.controller');
const router = require('express').Router()

router.get('/', auth)

module.exports = router;