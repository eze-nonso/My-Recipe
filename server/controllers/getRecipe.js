import {recipe as Recipe} from '../models';

export default (req, res, next) => {
  // check if logged in
  if (req.session.user) {
    Recipe.all({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'user_id'],
      }
    })
    .then(recipes =>
      res.send(recipes)
    )
    .catch(e => {
      res.writable
      ? res.status(500).send({
          [e.name]: e.message
        })
      : console.error('\nserver error:\n', e);
    });
  } else {
    res.status(403).send({
      status: 'fail, signin or signup'
    });
  }
}
