const { sign, verify } = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env;


const createTokens = (user) => {
  const accessToken = sign({
    name: user.name,
    rol: user.rol,
    id: user.id,
  }, `${TOKEN_SECRET}`);

  return accessToken;
};

const validateToken = (accessToken) => {
  
  try {
    const validToken = verify(accessToken, `${TOKEN_SECRET}`);
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
