import { user as User, Sequelize } from '../models';

const Op = Sequelize.Op;
// assuming input is validated


// also set session cookie on signin
export default (req, res) => {
  User.findOne({
    where: {
      [Op.or]: [
        {
          username: req.body.username
        }, {
          email: req.body.email
        }
      ],
      password: req.body.password
    },
    attributes: {
      exclude: ['password']
    }
  })
    .then((user) => {
      if (user) {
      // set session cookie on signin
        req.session.user = user.getDataValue('id');
        res.send({
          status: `Logged in as user ${user.get('username')}`,
          account: user.get({ plain: true })
        });
        // console.log(res.writable);
        return;
      }
      res.status(403).send({ status: 'Failed login, try again' });
    });
};
