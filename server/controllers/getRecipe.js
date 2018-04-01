import { recipe as Recipe, ingredient as Ingredient, review as Review, } from '../models';

export default (req, res) => {
  // check if logged in
  if (req.session.user) {
    return Recipe.all({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'user_id'],
      },
      include: [{
        model: Ingredient,
      }, {
        model: Review,
      }],
    })
      .then(recipes =>
        res.send(recipes))
      .catch(e => (
        res.writable
          ? res.status(500).send({
            [e.name]: e.message
          })
          : console.error('\nserver error:\n', e)));
  }
  return res.status(403).send({
    status: 'fail, signin or signup'
  });
};
