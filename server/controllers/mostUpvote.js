import { review as Review, recipe as Recipe, Sequelize, sequelize } from '../models';

const { Op } = Sequelize;

export default (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({
      status: 'fail',
      error: 'signin or signup',
    });
  }
  // works generally, apart from double nesting result
  return Review.all({
    where: {
      star: {
        [Op.gt]: 2
      }
    },
    attributes: [[sequelize.fn('count', sequelize.col('*')), 'upvotes']],
    include: [{
      model: Recipe,
    }],
    group: ['recipe.id'],
    order: [
      [
        sequelize.fn('count', sequelize.col('*')), req.query.order,
      ]
    ],
    limit: 5
  })
    .then(reviews => res.send(reviews))
    .catch(e =>
      (res.writable
        ? res.status(500).send({
          [e.name]: e.message
        })
        : console.error(e)));
};
