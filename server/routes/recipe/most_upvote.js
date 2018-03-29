import { mostUpvote } from '../../controllers';

export default app => {
  return app.get('/recipes', checkQuery, mostUpvote);
}


// implement such functions in ../../middlewares
function checkQuery(req, res, next) {
  
  if (req.query.sort === 'upvotes' && req.query.order) {

    req.query.order = req.query.order === 'ascending'
    ? 'asc'
    : 'desc';

    return next();
  }
  next('route');
}
