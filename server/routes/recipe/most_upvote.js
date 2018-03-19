import {mostUpvote} from '../../controllers';

export default app => {
  return app.get('/recipes', checkQuery, mostUpvote);
}

function checkQuery(req, res, next) {
  return req.query.sort === 'upvotes' && req.query.order === 'ascending'
  ? next()
  : next('route');
}
