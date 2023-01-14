const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/user
  create: {
    [Segments.BODY]: {
      fullname: Joi.string().min(1).max(100).required(),
      username: Joi.string().min(1).max(100).required(),
      password: Joi.string().min(1).max(100).required(),
      email: Joi.string().min(1).max(100).required(),
      phone: Joi.string().min(1).max(100).required(),
    },
  },
	// POST /api/v1/user/login
  login: {
    [Segments.BODY]: {
      username: Joi.string().min(1).max(100),
      password: Joi.string().min(1).max(100).required(),
      email: Joi.string().min(1).max(100),
      phone: Joi.string().min(1).max(100),
    },
  },
	// POST /api/v1/user/:id/role
  addrole: {
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
		[Segments.BODY]: {
			role: Joi.string().required(),
		},
  },
	// DELETE /api/v1/user/:id/role/:role
  deleterole: {
    [Segments.PARAMS]: {
      id: Joi.string().required(),
			role: Joi.string().required(),
    },
  },
  // GET /api/v1/user/:id
  read: {
    [Segments.PARAMS]: {
      id: Joi.string(),
    },
  },
  // PATCH /api/v1/user/:id
  update: {
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
        fullname: Joi.string().min(1).max(100),
        username: Joi.string().min(1).max(100),
        password: Joi.string().min(1).max(100),
        email: Joi.string().min(1).max(100),
        phone: Joi.string().min(1).max(100),
    },
  },
  // DELETE /api/v1/user/:id
  remove: {
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  },
};