module.exports = [
  {
    id: "repair_pc",
    name: "Repair Your First PC",
    emoji: "🖥️",

    description: "Your first customer needs help repairing an old computer.",

    requirements: {
      level: 1,
      previousMission: null,
    },

    objectives: [
      {
        id: 1,
        type: "buy_item",
        item: "toolkit",
        amount: 1,
        description: "Buy a Toolkit."
      },
      {
        id: 2,
        type: "explore",
        target: "broken_pc",
        amount: 1,
        description: "Find a broken PC."
      },
      {
        id: 3,
        type: "repair",
        target: "broken_pc",
        amount: 1,
        description: "Repair the PC."
      },
      {
        id: 4,
        type: "deliver",
        target: "customer",
        amount: 1,
        description: "Return the repaired PC."
      }
    ],

    rewards: {
      credits: 100,
      xp: 30,
      items: []
    }
  },

  {
    id: "wifi_installation",
    name: "Install Office WiFi",
    emoji: "📡",

    description: "A small office needs a stable WiFi connection.",

    requirements: {
      level: 2,
      previousMission: ["repair_pc"]
    },

    objectives: [
      {
        id: 1,
        type: "buy_item",
        item: "wifi",
        amount: 1,
        description: "Buy a WiFi Router."
      },
      {
        id: 2,
        type: "travel",
        target: "office",
        amount: 1,
        description: "Go to the office."
      },
      {
        id: 3,
        type: "install",
        target: "wifi",
        amount: 1,
        description: "Install the WiFi."
      },
      {
        id: 4,
        type: "test",
        target: "wifi",
        amount: 1,
        description: "Test the network."
      }
    ],

    rewards: {
      credits: 350,
      xp: 80,
      items: []
    }
  },

  {
    id: "build_website",
    name: "Build a Business Website",
    emoji: "💻",

    description: "A local business wants their first website.",

    requirements: {
      level: 3,
      previousMission: ["wifi_installation"]
    },

    objectives: [
      {
        id: 1,
        type: "buy_item",
        item: "gaminglaptop",
        amount: 1,
        description: "Buy a Laptop."
      },
      {
        id: 2,
        type: "code",
        target: "website",
        amount: 3,
        description: "Develop the website."
      },
      {
        id: 3,
        type: "deploy",
        target: "website",
        amount: 1,
        description: "Deploy the website."
      }
    ],

    rewards: {
      credits: 800,
      xp: 150,
      items: []
    }
  }
];