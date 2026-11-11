const Player = require("../models/Player");

const getPlayers = async(req, res) =>{
    const players = await Player.find()
        .select("username avatar credits level")
        .lean()
    return res.json(players);
}

module.exports = getPlayers