const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("not authorized");

  try {
    const jwtsecretKey = process.env.SECRET_KEY;
    const payload = jwt.verify(token, jwtsecretKey);
    req.user = payload;
    next();
  } catch (error) {
    res.status(400).send("INVALID TOKEN ");
  }
}

module.exports = auth;
