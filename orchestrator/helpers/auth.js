const redis = require("../config/ioredis")
const axios = require("axios");
const USERS_URL = process.env.USERS_URL;

async function authGenerator(token) {
  try {
    const cache = await JSON.parse(await redis.get("user"));
    if (cache?.access_token === token) {
      return cache
    } else {
      const { data } = await axios({
        url: `${USERS_URL}authenticating`,
        headers: { access_token: token },
      });
      const userToken = {
        access_token : token,
        user: data,
      };
      await redis.set("user", JSON.stringify(userToken));
      return userToken
    }
  } catch (error) {
    throw error
  }
}

module.exports = authGenerator