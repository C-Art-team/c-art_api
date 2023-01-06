const { verifyAuthToken } = require("../helpers/");

async function authentication(req, res, next) {
  try {
    const { auth_token } = req.headers;
    if (!auth_token) {
      throw { name: "Unauthorized" };
    }
    const payload = verifyAuthToken(auth_token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;
