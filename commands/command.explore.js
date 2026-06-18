module.exports = (message) => {
  const outcomes = [
    `📦 Found a Supply Crate!`,
    `🤖 Defeated a Rogue Bot!`,
    `💎 Found a Data Shard!`,
    `🗺️ Discovered an Abandoned Server!`,
    `🔋 Found a Battery Pack!`,
    `💰 Found Credits on the Ground!`,
    `⚠️ Ambushed by Scavengers!`,
    `🛰️ Discovered a Satellite Station!`,
    `📡 Repaired an Old Antenna!`,
    `❌ Nothing Found.`,
  ];
  const randomNumber = Math.floor(Math.random() * outcomes.length);

  message.reply(outcomes[randomNumber])
};
