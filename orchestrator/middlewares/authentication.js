const axios = require("axios");
const USERS_URL = process.env.USERS_URL;

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    const { data } = await axios({
      url: `${USERS_URL}authentication`,
      headers: { access_token },
    });
    req.user = {
      access_token: data.access_token,
      id: data.id,
      email: data.email,
      username: data.username,
      preference: data.preference,
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;
