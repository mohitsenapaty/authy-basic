const { logger } = require('../../../config/logger');
const httpStatus = require('http-status');
const moment = require('moment');
const Client = require('../../models/client.model');
const cModel = require('../../models/client.model');

/**
 * Create Client
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const client = await cModel.createClient(req.body);
    logger.info(client);
    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED, message: 'Client created successfully', client
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Read Client
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const readClient = await Client.findOne({ _id: req.params.id, archived: false });

    if (readClient) {
      return res.status(httpStatus.OK).json({
        code: httpStatus.OK, message: 'Client fetched successfully', readClient
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
 * List Client
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const clients = await Client.find({ archived: false });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'Client(s) fetched successfully', clients
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update Client
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const client = await Client.updateClient({
      _id: req.params.id,
      archived: false,
    }, req.body, req.body.reset);

    if (client) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Client updated successfully', client });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Client
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (client) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};