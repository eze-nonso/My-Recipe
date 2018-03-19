import {review as Review, user as User, recipe as Recipe, sequelize} from '../models';

export default (req, res, next) =>
  req.body.review && req.session.user
  ? sequelize.transaction(t =>
    Review.upsert({
      comment: req.body.review,
      star: req.body.star || null,
      user_id: req.session.user,
      recipe_id: req.params['recipeId'],
    }, {
      fields: ['comment', 'star', 'recipe_id', 'user_id'],
      returning: true,
      transaction: t
    })
  )
  .then(([review, created]) => {
    created
    ? res.status(201).send({
      status: 'review added'
    })
    : res.status(201).send({
      status: 'review updated'
    })
  })
  .catch(e =>
    res.writable
    ? res.send({
      [e.name]: e.message
    })
    : console.error('\nserver error\n', e)
  )
  : req.session.user
  ? res.status(400).send({
    status: 'fail, review cannot be empty'
  })
  : res.status(403).send({
    status: 'fail, login or signup'
  })
