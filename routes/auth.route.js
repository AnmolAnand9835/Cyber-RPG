const auth = require("../controllers/auth.controller");
const router = require("express").Router();

router.use("/", auth);

module.exports = router;