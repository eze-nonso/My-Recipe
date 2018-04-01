import { user as User, Sequelize } from '../models';

const { Op } = Sequelize;
// !!findCreateFind will not work under a transaction in postgres
export default (req, res) => {
  User.findCreateFind({
    where: {
      [Op.or]: [
        {
          username: req.body.username
        }, {
          email: req.body.email
        },
      ]
    },
    defaults: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }
  })
    .then(([user, created]) => {
      if (created) {
      // set cookie
        req.session.user = user.dataValues.id;
        res.status(201).send({
          status: 'account created',
          id: user.getDataValue('id')
        });
        return 'jump';
      }
      return User.findOne({
        where: {
          username: req.body.username
        },
        attributes: [
          'username'
        ]
      });
    })
    .then((exists) => {
      switch (exists) {
        case 'jump':
          break;
        case null:
          res.status(400).send({ status: 'email in use' });
          break;
        default:
          res.status(400).send({ status: 'username in use' });
      }
    });
};
