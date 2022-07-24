const express = require('express');
const { celebrate: validate } = require('celebrate');
// const { authorize } = require('../../middlewares/auth');
const controller = require('../../controllers/v1/role.controller');
const {
  create,
  read,
  update,
  remove,
} = require('../../validations/role.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/role Create Role
   * @apiDescription Create Role
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup Role
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} Role
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  // .post(validate(create), authorize(['admin']), controller.create);
  .post(validate(create), controller.create);

router
  .route('/')
  /**
   * @api {get} api/v1/role List Role
   * @apiDescription List Role
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup Role
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Array} Role
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(controller.list);

router
  .route('/:id')
  /**
   * @api {get} api/v1/role/:id Read Role
   * @apiDescription Read Role
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup Role
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} Role
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(validate(read), controller.read);

router
  .route('/:id')
  /**
   * @api {put} api/v1/role/:id Update Role
   * @apiDescription Update Role
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup Role
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} Role
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .put(validate(update), controller.update);

router
  .route('/:id')
  /**
   * @api {delete} api/v1/role/:id Delete Role
   * @apiDescription Delete Role
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup Role
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

module.exports = router;