import { review as Review, sequelize } from '../models';

export default (req, res) =>
  (
    req.body.review && req.session.user
      ? sequelize.transaction(t =>
        Review.upsert({
          comment: req.body.review,
          star: req.body.star || null,
          user_id: req.session.user,
          recipe_id: parseInt(req.params.recipeId, 10),
        }, {
          fields: ['comment', 'star', 'recipe_id', 'user_id'],
          returning: true,
          transaction: t
        }))
        .then(([, created]) => (created
          ? res.status(201).send({
            status: 'review added'
          })
          : res.send({
            status: 'review updated'
          })))
        .catch(e =>
          (
            res.writable
              ? res.send({
                [e.name]: e.message
              })
              : console.error('\nserver error\n', e)
          ))
      : req.session.user
        ? res.status(400).send({
          status: 'fail',
          error: 'review cannot be empty'
        })
        : res.status(403).send({
          status: 'fail',
          error: 'login or signup'
        })
  );
