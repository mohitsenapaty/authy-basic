const { logger } = require('../../../config/logger');
const httpStatus = require('http-status');
const moment = require('moment');
const Role = require('../../models/role.model');

/**
 * Create Role
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const exists = await Role.scan({ _id: req.body.name, archived: false }).exec();
    if (exists.length > 0){
      return res.status(httpStatus.CREATED).json({
        code: httpStatus.CREATED, message: 'Role created successfully', role: exists[0]
      });
    }
    const role = await Role.create({...req.body});
    logger.info(role);
    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED, message: 'Role created successfully', role
    });
  } catch (error) {
    // TODO: make idempotent by handling unique constraint violation error
    return next(error);
  }
};

/**
 * Read Role
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const role = await Role.scan({ _id: req.params.id, archived: false }).exec();

    if (role) {
      return res.status(httpStatus.OK).json({
        code: httpStatus.OK, message: 'Role fetched successfully', role
      });
    }
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND, message: 'Resource not found'
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * List Role
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    logger.info(req.query);
    const roles = await Role.scan({
      ...(req.query.name) && {
        name: {eq: req.query.name}
      }
    }).exec();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'Role(s) fetched successfully', roles
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update Role
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const role = await Role.update({_id: req.params.id,}, ...req.body);

    if (role) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Role updated successfully', role });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Role
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const role = await Role.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (role) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};