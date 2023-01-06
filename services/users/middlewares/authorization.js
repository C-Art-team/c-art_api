async function authorization(req, res, next) {
  try {
    const { id } = req.params;
    const activeUser = req.user.id;
    if (id !== activeUser) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authorization;
