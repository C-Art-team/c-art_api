const authGenerator = require("../helpers/auth");

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    const userToken = await authGenerator(access_token);
    req.user = userToken;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;
