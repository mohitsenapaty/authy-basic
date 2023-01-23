const dynamoose = require("dynamoose");

const { dynamoConfig, env } = require('./vars');

exports.init = () => {
  dynamoose.aws.sdk.config.update({
    accessKeyId: dynamoConfig.aws.accessKeyId,
    secretAccessKey: dynamoConfig.aws.secretAccessKey,
    region: dynamoConfig.aws.region
  });
  if (env == 'local') dynamoose.aws.ddb.local(dynamoConfig.local.url)
};

exports.dynamoose = dynamoose;