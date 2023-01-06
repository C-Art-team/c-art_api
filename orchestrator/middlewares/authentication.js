const axios = require("axios");
const USERS_URL = process.env.USERS_URL;
const redis = require("../config/ioredis");

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    const cache = await JSON.parse(await redis.get("user"));
    if (cache?.access_token === access_token) {
      req.user = cache;
    } else {
      const { data } = await axios({
        url: `${USERS_URL}authenticating`,
        headers: { access_token },
      });
      const userToken = {
        access_token,
        auth_token: data.auth_token,
      };
      req.user = userToken;
      await redis.set("user", JSON.stringify(userToken));
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;
