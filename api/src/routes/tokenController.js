const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign({
    name: user.name,
    rol: user.rol,
    id: user.id,
  }, "jwtsecretplschange");

  return accessToken;
};

const validateToken = (accessToken) => {
  
  try {
    const validToken = verify(accessToken, "jwtsecretplschange");
    if (validToken) {
      return validToken;
    } else {
      return '';
    }
  } catch (error) {
    console.log(error);
    return '';
  }
}

module.exports = {
  createTokens,
  validateToken,
};