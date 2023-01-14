const express = require('express');
const { celebrate: validate } = require('celebrate');
// const { authorize } = require('../../middlewares/auth');
const controller = require('../../controllers/v1/user.controller');
const {
  create,
  read,
  update,
  remove,
  login,
  addrole,
  deleterole,
} = require('../../validations/user.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/user Create User
   * @apiDescription Create User
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} User
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  // .post(validate(create), authorize(['admin']), controller.create);
  .post(validate(create), controller.create);

router
  .route('/')
  /**
   * @api {get} api/v1/user List User
   * @apiDescription List User
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Array} User
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(controller.list);

router
  .route('/:id')
  /**
   * @api {get} api/v1/user/:id Read User
   * @apiDescription Read User
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} User
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(validate(read), controller.read);

router
  .route('/:id')
  /**
   * @api {put} api/v1/user/:id Update User
   * @apiDescription Update User
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} User
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .patch(validate(update), controller.update);

router
  .route('/:id')
  /**
   * @api {delete} api/v1/user/:id Delete User
   * @apiDescription Delete User
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} sucess/failure
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .delete(validate(remove), controller.delete);

router
  .route('/login')
  /**
   * @api {post} api/v1/user/login Login User
   * @apiDescription Login User
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup User
   * @apiPermission users
   *
   * @apiHeader {String} Authorization  No auth
   *
   * @apiSuccess {Object} User + jwt token
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only users present can access
   */
  // .post(validate(create), authorize(['admin']), controller.create);
  .post(validate(login), controller.login);

router
  .route('/jwtvalidate')
  /**
   * @api {post} api/v1/user/jwtvalidate Validate User JWT token
   * @apiDescription Validate User JWT token
   * @apiVersion 1.0.0
   * @apiName jwtvalidate
   * @apiGroup User
   * @apiPermission users
   *
   * @apiHeader {String} Authorization  No auth
   *
   * @apiSuccess {Object} User + jwt token
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only valid token of user allowed
   */
  // .post(validate(create), authorize(['admin']), controller.create);
  .post(controller.jwtvalidate);

router
  .route('/:id/role')
  /**
   * @api {post} api/v1/user/:id/role Add role to a user
   * @apiDescription Add role to a user
   * @apiVersion 1.0.0
   * @apiName Add role
   * @apiGroup User
   * @apiPermission users
   *
   * @apiHeader {String} Authorization  No auth
   *
   * @apiSuccess {Object} User + jwt token
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  // .post(validate(create), authorize(['admin']), controller.create);
  .post(validate(addrole), controller.addrole);

router
  .route('/:id/role/:role')
  /**
   * @api {post} api/v1/user/:id/role/:role Delete role from a user
   * @apiDescription Delete role from a user
   * @apiVersion 1.0.0
   * @apiName Delete role
   * @apiGroup User
   * @apiPermission users
   *
   * @apiHeader {String} Authorization  No auth
   *
   * @apiSuccess {Object} User + jwt token
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  // .post(validate(create), authorize(['admin']), controller.create);
  .delete(validate(deleterole), controller.deleterole);

module.exports = router;