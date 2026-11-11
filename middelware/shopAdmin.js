module.exports = (req, res, next) => {
  const allowedIds = (process.env.SHOP_ADMIN_DISCORD_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!allowedIds.includes(req.user?.discordId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return next();
};
