import { mostUpvote } from '../../controllers';

// implement such functions in ../../middlewares
const checkQuery = (req, res, next) => {
  if (req.query.sort === 'upvotes' && req.query.order) {
    req.query.order = req.query.order === 'ascending'
      ? 'asc'
      : 'desc';

    return next();
  }
  next('route');
};

export default app => app.get('/recipes', checkQuery, mostUpvote);
