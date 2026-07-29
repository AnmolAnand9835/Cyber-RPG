const common = [
  {
    message: "📦 Found a Supply Crate!",
    credits: 15,
    xp: 5,
  },
  {
    message: "🔋 Found a Battery Pack!",
    credits: 20,
    xp: 5,
  },
  {
    message: "💰 Found Credits on the Ground!",
    credits: 10,
    xp: 2,
  },
  {
    message: "🖱️ Sold an Old Mouse.",
    credits: 25,
    xp: 5,
  },
  {
    message: "⌨️ Repaired an Old Keyboard.",
    credits: 30,
    xp: 8,
  },
  {
    message: "📚 Read Programming Notes.",
    credits: 0,
    xp: 10,
  },
  {
    message: "☕ Helped at a Coffee Shop.",
    credits: 20,
    xp: 5,
  },
  {
    message: "🧹 Cleaned a Computer Store.",
    credits: 15,
    xp: 5,
  },
  {
    message: "📦 Found Some Scrap Electronics.",
    credits: 35,
    xp: 10,
  },
  {
    message: "❌ Nothing Interesting Happened.",
    credits: 0,
    xp: 0,
  },
];

const uncommon = [
  {
    message: "🤖 Defeated a Rogue Bot!",
    credits: 100,
    xp: 25,
  },
  {
    message: "📡 Repaired an Old Antenna!",
    credits: 120,
    xp: 25,
  },
  {
    message: "💎 Found a Data Shard!",
    credits: 150,
    xp: 35,
  },
  {
    message: "📦 Sold Recycled Computer Parts.",
    credits: 180,
    xp: 30,
  },
  {
    message: "🛒 Fixed a Shop's Computer.",
    credits: 200,
    xp: 40,
  },
  {
    message: "⚠️ Ambushed by Scavengers!",
    credits: -50,
    xp: 20,
  },
  {
    message: "🦹 A Thief Stole Some Credits!",
    credits: -75,
    xp: 15,
  },
];

const rare = [
  {
    message: "🗺️ Discovered an Abandoned Server!",
    credits: 400,
    xp: 70,
  },
  {
    message: "🛰️ Discovered a Satellite Station!",
    credits: 500,
    xp: 80,
  },
  {
    message: "💾 Sold an Old Hard Drive Full of Data!",
    credits: 450,
    xp: 60,
  },
  {
    message: "🔐 Found a Security Vulnerability Bounty!",
    credits: 600,
    xp: 90,
  },
  {
    message: "🧰 Recovered Expensive Computer Parts.",
    credits: 350,
    xp: 60,
  },
];

const epic = [
  {
    message: "💻 A Startup Hired You for a Quick Project!",
    credits: 1200,
    xp: 150,
  },
  {
    message: "🚀 You Successfully Deployed a Major Project!",
    credits: 1500,
    xp: 180,
  },
  {
    message: "🏆 Won a Local Hackathon!",
    credits: 1800,
    xp: 200,
  },
];

const legendary = [
  {
    message: "💎 You Found a Hidden Crypto Wallet!",
    credits: 5000,
    xp: 400,
  },
  {
    message: "🦄 A Billionaire Bought Your Side Project!",
    credits: 10000,
    xp: 600,
  },
];

module.exports = {
  common,
  uncommon,
  rare,
  epic,
  legendary,
};