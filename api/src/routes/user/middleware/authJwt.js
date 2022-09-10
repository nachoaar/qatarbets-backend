const jwt = require("jsonwebtoken");
const config = require("../authConfig")
const User = require("../../../db")


verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => { // codificamos el tokens
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.id).then(user => {
    const userol = user.rol
        if (userol === "admin") {
          next();
          return;
        }
      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
module.exports = authJwt;
