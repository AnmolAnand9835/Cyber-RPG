const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  console.log("Cookie Header:", req.headers.cookie);

  const token = req.cookies?.token;

  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

// module.exports = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({
//       message: "Unauthorized",
//     });
//   }

//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     return res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// };