import { recipe as Recipe, review as Review, Sequelize } from '../models';

const { Op } = Sequelize;
export default (req, res) =>
  //  this returns recipes that the particular user has reviewed with

  // more than 2 stars. specs may change in the future

  Recipe.all({
    include: [{
      model: Review,
      where: {
        star: {
          [Op.gt]: 2
        },
        user_id: parseInt(req.session.user, 10) // analogous to including User
      },
      attributes: [],
    }]
  })
    .then(recipes =>
      res.send(recipes))
    .catch(e =>
      (res.writable
        ? res.status(500).send({
          [e.name]: e.message
        })
        : console.error(e)));
