import {createUser as create} from '../../controllers';

export default app =>
  app.post('/users/signup', blockNull, create)


const blockNull = (req, res, next) => {
  if (req.body.username && req.body.email && req.body.password) {
    next();
    return;
  }
  res.status(400).send({status: 'Incomplete fields'});
}
