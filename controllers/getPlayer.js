const Player = require("../models/Player");

const getPlayer = async(req, res) =>{
    
    const player = await Player.findOne({
    userId: req.params.id,
  })
    return res.json(player);
}

module.exports = getPlayer