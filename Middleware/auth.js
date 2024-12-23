const { validateToken } = require("../Helper/helper");

const AuthMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    if (token) {
      let { data } = validateToken(token);
      if (data) {
        req.headers["userID"] = data;
        next();
      }
    } else {
      return res.status(401).json({ error: "Invalid token." });
    }
  } else {
    return res.status(401).json({ error: "Authorization token is required." });
  }
};

module.exports = AuthMiddleware;
