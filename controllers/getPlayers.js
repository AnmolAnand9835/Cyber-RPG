const Player = require("../models/Player");

const getPlayers = async(req, res) =>{
    const players = await Player.find()
    return res.json(players);
}

module.exports = getPlayers