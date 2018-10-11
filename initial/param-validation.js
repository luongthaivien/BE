import Joi from './joi_i18n';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      phone: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      phone: Joi.string().regex(/(01[2689]|09)[0-9]{8}$/).required()
    },
    params: {
      id: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
