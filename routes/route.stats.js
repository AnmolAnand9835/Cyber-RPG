const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    uptime: process.uptime(),
  });
});

module.exports = router;