const player = require('../Data/data.players')
const players = require('../Data/data.player')


module.exports = (message) => {
  if(players[message.author.id]){
    message.reply(`You'r already start the game`)
  }
  else{
  player(message)
  message.reply(`
    [ welcome to Dyno RPG a game for hacker ]
👤 Operative Created
⭐ Level: 1
📈XP:0
💰 Credits: 500

💻 Starter Gear:
Old Laptop
`);
  }
};

