const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { isEmpty, omit, startsWith, remove, uniq } = require('lodash');
const httpStatus = require('http-status');
const moment = require('moment');

const { logger } = require('../../../config/logger');
const User = require('../../models/user.model');
const Role = require('../../models/role.model');
const { jwtKey } = require('../../../config/vars');

/**
 * Create User
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const exists = await User.scan({ _id: req.body.username, archived: false }).exec();
    if (exists.length > 0){
      return res.status(httpStatus.CREATED).json({
        code: httpStatus.CREATED, message: 'User created successfully', user: exists[0]
      });
    }
    const user = await User.createUser({...req.body});
    logger.info(user);
    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED, message: 'User created successfully', user
    });
  } catch (error) {
    // TODO: make idempotent by handling unique constraint violation error
    return next(error);
  }
};

/**
 * Read User
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const user = await User.query({ _id: req.params.id, archived: false }).exec();

    if (user) {
      return res.status(httpStatus.OK).json({
        code: httpStatus.OK, message: 'User fetched successfully', user
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
 * List User
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.query({
      ...(req.query.username) && {
        username: {eq: req.query.username}
      },
      ...(req.query.email) && {
        email: {eq: req.query.email}
      },
      ...(req.query.phone) && {
        phone: {eq: req.query.phone}
      },
    }).exec();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'User(s) fetched successfully', users
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update User
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const user = await User.updateUser({_id: req.params.id,}, {...req.body});

    if (user) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'User updated successfully', user });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete User
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (user) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * User login
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const users = await User.query({
      ...(req.body.username) && {
        username: {eq: req.body.username}
      },
      ...(req.body.email) && {
        email: {eq: req.body.email}
      },
      ...(req.body.phone) && {
        phone: {eq: req.body.phone}
      },
    }).exec();

    if (isEmpty(users) || users.length > 1) {
      return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
    }
    if (users[0].password && !bcrypt.compareSync(req.body.password, users[0].password)) {
      return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.BAD_REQUEST, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { user_id: users[0]._id },
      jwtKey,
      {
        expiresIn: "365d",
      }
    );
    const user = {
      ...omit(users[0], 'password'),
      token,
    }

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'User token created successfully', user
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Validate User JWT
 * @public
 */
exports.jwtvalidate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!(startsWith(auth, 'JWT ') && auth.split(' ').length == 2)) {
      // invalid token
      return res.status(httpStatus.FORBIDDEN).json({ code: httpStatus.FORBIDDEN});
    }
    const token = auth.split(' ')[1];
    if (isEmpty(token)) {
      // invalid token
      return res.status(httpStatus.FORBIDDEN).json({ code: httpStatus.FORBIDDEN});
    }
    const decoded = jwt.verify(token, jwtKey);
    const currentTime = moment();

    const user = await User.get({_id: decoded.user_id});
    if (isEmpty(user) || user.archived || currentTime.unix() > decoded.exp) {
      return res.status(httpStatus.FORBIDDEN).json({ code: httpStatus.FORBIDDEN});
    }

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'Token decoded', user: { ...omit(user, 'password'), token }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Add role
 * @public
 */
exports.addrole = async (req, res, next) => {
  try {
    const user = await User.get({ _id: req.params.id });
    const role = await Role.get({ _id: req.body.role });
    let currUserRoles = (!isEmpty(user.roles)) ? user.roles : [];
    currUserRoles.push(role.name);
    currUserRoles = uniq(currUserRoles);

    if (isEmpty(user) || isEmpty(role)) {
      return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
    }
    const newUser = await User.updateUser({ _id: req.params.id }, { roles: currUserRoles });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'Role Added', user: { ...omit(newUser, 'password') }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * delete role
 * @public
 */
exports.deleterole = async (req, res, next) => {
  try {
    const user = await User.get({ _id: req.params.id });
    const role = await Role.get({ _id: req.params.role });
    let currUserRoles = (!isEmpty(user.roles)) ? user.roles : [];
    remove(currUserRoles, (r) => r == role.name);

    if (isEmpty(user) || isEmpty(role)) {
      return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
    }
    const newUser = await User.updateUser({ _id: req.params.id }, { roles: currUserRoles });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'Role Deleted', user: { ...omit(newUser, 'password') }
    });
  } catch (error) {
    return next(error);
  }
};