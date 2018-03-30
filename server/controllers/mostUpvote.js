import { review as Review, recipe as Recipe, Sequelize, sequelize } from '../models';

const Op = Sequelize.Op;

export default (req, res, next) => {
  // breaks on attempt to apply limit
  // return Recipe.all({
  //   attributes: {
  //     include: [[sequelize.fn('count', sequelize.col('*')), 'upvotes']]
  //   },
  //   include: [{
  //     model: Review,
  //     where: {
  //       star: {
  //         [Op.gt]: 2
  //       }
  //     },
  //     attributes: [],
  //   }],
  //   // limit: 3,
  //   group: ['recipe.id'],
  //   order: [[sequelize.fn('count', sequelize.col('*')), 'DESC']]
  // })
  // .then(recipes => res.send(recipes))

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

  // if (!req.session.user) return res.status(403).send({
  //   status: 'fail, signin or signup'
  // });
  //
  // return sequelize.query(
  //   "select count(*) as upvotes, recipe.* from shuffler.recipes as recipe inner join shuffler.reviews as review on recipe.id = review.recipe_id and review.star > 2 group by recipe.id order by count(*) ASC limit 5", {
  //   type: sequelize.QueryTypes.SELECT
  // })
  // .then(results => res.send(results))
};
