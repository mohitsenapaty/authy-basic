const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/role
  create: {
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50)
        .required(),
      description: Joi.string().allow(''),
    },
  },
  // GET /api/v1/role/:id
  read: {
    [Segments.PARAMS]: {
      id: Joi.string(),
    },
  },
  // PUT /api/v1/role/:id
  update: {
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50),
      description: Joi.string().allow(''),
    },
  },
  // DELETE /api/v1/role/:id
  remove: {
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  },
};