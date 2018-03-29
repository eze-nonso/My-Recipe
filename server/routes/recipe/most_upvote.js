import { mostUpvote } from '../../controllers';

export default app => {
  return app.get('/recipes', checkQuery, mostUpvote);
}


// implement such functions in ../../middlewares
function checkQuery(req, res, next) {
  return req.query.sort === 'upvotes' && req.query.order
  ? next()
  : next('route');

  if (req.query.sort === 'upvotes' && req.query.order) {
    req.query.order = req.query.order === 'ascending'
    ? 'asc'
    : 'desc';

    return next();
  }
  next('route');
}
