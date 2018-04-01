import { createUser as create } from '../../controllers';

// implement such in ../../middlewares || expressvalidator
const blockNull = (req, res, next) => {
  if (req.body.username && req.body.email && req.body.password) {
    next();
    return;
  }
  res.status(400).send({ status: 'Incomplete fields' });
};

export default app =>
  app.post('/users/signup', blockNull, create);
