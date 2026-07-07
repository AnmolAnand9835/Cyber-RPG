const auth = require("../middelware/auth");
const router = require("express").Router();

router.get("/me", auth, (req, res) => {
    res.json(req.user);
});


module.exports = router;