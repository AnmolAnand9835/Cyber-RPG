const player = require('../Data/data.player')

module.exports = (message) =>{
    message.reply(`you have ${player.credits} credits`)
}