const Shop = require("../models/Shop");

const getShop = async(req, res) => {
    // Access the parsed data from the request body
    const shopData = req.body; 

    // Validate the incoming data
    if (!shopData.name || !shopData.emoji || !shopData.price || !shopData.rarity || !shopData.description || !shopData.effect) {
        return res.status(400).json({ error: 'Somthing field is missing' });
    }

    // Process the data (e.g., save to a database) here...
     const newShop = await Shop.create({
          name: shopData.name,
          emoji: shopData.emoji,
          price: shopData.price,
          rarity: shopData.rarity,
          description: shopData.description,
          effect : shopData.effect
        });
    // 4. Send a success response back to the client
    res.status(201).json({
        message: 'User created successfully!',
        data: newShop
    });
}

module.exports = getShop;
