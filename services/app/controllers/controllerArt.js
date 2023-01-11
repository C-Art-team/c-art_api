const { Art, Preview, sequelize, Category,Order } = require("../models");
const { Op } = require("sequelize");

class ControllerArt {
  static async createArt(req, res, next) {
    const t = await sequelize.transaction();
    try {

      // console.log(req.isSingle);
      

      const AuthorId = req.user.id;
      let { name, price, description, CategoryId } = req.body;
      ////REQ.FILES RECIEVES AN ARRAY OF 4 OBJECTS. FIRST IS SOURCE FOR ART, THE REST IS FOR PREVIEWS
      let art = await Art.create({
        name,
        price,
        description,
        AuthorId,
        source: req.files[0].publicUrl,
        CategoryId,
        status: "Active",
      });

      let previews = req.files.slice(1);
     
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
      await t.rollback();
      next(error);
    }
  }

  static async getArts(req, res, next) {
    try {
      const { filter, search } = req.query;
      let option = {
        include: [
          {
            model: Preview,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      };
      let where = {};
      if (filter) {
        where.CategoryId = filter;
      }
      if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
      }
      if (where) {
        option.where = where;
      }
      // console.log(option);
      let arts = await Art.findAll(option);
      // console.log(arts);
      res.status(200).json(arts);
    } catch (error) {
      next(error)
    }
  }

  static async getMyArt(req,res,next){
    try {

      let AuthorId = req.user.id

      const arts = await Art.findAll({where: {AuthorId}, include:[{model: Preview}, {model:Category}, {model:Order}]})

      res.status(200).json(arts)
    } catch (error) {
      next(error)
    }
  }

  static async getOneArt(req, res, next) {
    try {
      let { id } = req.params;
      let art = await Art.findOne({
        where: { id },
        include: [
          {
            model: Preview,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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
      const artToDelete = Art.findByPk(id);
      if (!artToDelete) throw { name: "NOT FOUND" };

      // note: status default pas create: active. Kalo mau seeding jangan lupa tambahin di seeders
      await Art.update({ status: "Inactive" }, { where: { id } });
      res.status(200).json({
        message: `Art with id ${id} has been deactivated`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async restoreArtStatus(req, res, next) {
    try {
      const { id } = req.params;
      const artToRestore = Art.findByPk(id);
      if (!artToRestore) throw { name: "NOT FOUND" };

      await Art.update({ status: "Active" }, { where: { id } });
      res.status(200).json({
        message: `Art with id ${id} has been reactivated`,
      });
    } catch (error) {}
  }

  static async updateArt(req, res, next) {
    try {
      const { id } = req.params;
      const { price } = req.body;
      const artToUpdate = Art.findByPk(id);
      if (!artToUpdate) throw { name: "NOT FOUND" };
      if (!price || price < 0) throw { name: "INVALID INPUT" };

      const updatedArt = await Art.update(
        {
          price,
        },
        { where: { id } }
      );
      res.status(200).json({ updatedArt });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerArt;
