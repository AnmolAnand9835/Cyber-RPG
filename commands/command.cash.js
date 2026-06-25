const player = require('../Data/data.player')
const regester = require('../default meassage/msg.regester')

module.exports = (message) =>{
    if(player[message.author.id]){
    message.reply(`you have ${player[message.author.id].credits} credits`)
    }else{
        regester(message)
    }
}