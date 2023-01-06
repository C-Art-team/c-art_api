const { Art, Preview, sequelize } = require("../models");

class ControllerArt {
  static async createArt(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let { name, price, description, CategoryId } = req.body;
      ////REQ.FILES RECIEVES AN ARRAY OF 4 OBJECTS. FIRST IS SOURCE FOR ART, THE REST IS FOR PREVIEWS
      let art = await Art.create({
        name,
        price,
        description,
        AuthorId: 1,
        source: req.files[0].publicUrl,
        CategoryId,
        status: "Active",
      });

      let previews = req.files.slice(1);
      console.log(previews);
      let convertedPreviews = previews.map((el) => {
        el.sourceUrl = el.publicUrl;
        el.ArtId = art.dataValues.id;
        return el;
      });

      let newPreviews = await Preview.bulkCreate(convertedPreviews);

      await t.commit();
      art.dataValues.Previews = newPreviews;
      res.status(201).json({ art });

    } catch (error) {
      // console.log(error);
      await t.rollback()
      next(error);
    }
  }

  static async getArts(req, res, next) {
    try {
      let arts = await Art.findAll({
        include: [{
          model: Preview,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      // console.log(arts);
      res.status(200).json(arts);
    } catch (error) {
      console.log(error);
      // next(error)
    }
  }

  static async getOneArt(req, res, next) {
    try {
      let { id } = req.params;
      let art = await Art.findOne({
        where: { id },
        include: [{
          model: Preview,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });

      if (!art) {
        throw { name: "NOT FOUND" };
      }

      res.status(200).json(art);
    } catch (error) {
      next(error);
    }
  }

  static async deleteArt(req, res, next) {
    try {
      const { id } = req.params;
      // note: status default pas create: active. Kalo mau seeding jangan lupa tambahin di seeders
      await Art.update({ status: "inactive" }, { where: { id } });
    } catch (error) {
      next(error);
    }
  }

  static async updateArt(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { price } = req.body;

      const updatedArt = await Art.update(
        {
          price
        },
        { where: { id } }
      )
      res.status(200).json({ updatedArt });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerArt;
