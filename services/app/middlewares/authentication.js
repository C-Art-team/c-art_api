async function authentication(req, res, next) {
  try {
    const { access_token, id, email, username, preference } = req.headers;
    if (!access_token) {
      throw { name: "NO TOKEN" };
    }
    req.user = { id, email, username, preference };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;
