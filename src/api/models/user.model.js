const dynamoose = require("dynamoose");
const { omit, isEmpty, pick, compact } = require('lodash');
const bcrypt = require('bcryptjs');

const id_gen = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

const userSchema = new dynamoose.Schema({
  _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    hashKey: true,
    default: id_gen
  },
  fullname: {
    type: String,
  },
  username: {
    type: String,
    index: {
      name: 'username',
      global: true,
    },
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    index: {
      name: 'email',
      global: true,
    },
  },
  phone: {
    type: String,
    index: {
      name: 'phone',
      global: true,
    },
  },
  roles: {
    type: Array,
    schema: [String],
    default: [],
  },
  archived: {
    type: Boolean,
    default: false,
  },
  archivedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const userModel = dynamoose.model("User", userSchema);

userModel.methods.set("createUser", async function (params) {
  const inputPassword = params.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(inputPassword, salt);
  const createParams = {
    ...(params),
    _id: id_gen()
  }
  await dynamoose.transaction([
    this.transaction.create({...omit(createParams, 'password'), password: hash}),
    this.transaction.create({_id: `phone#${params.phone}`}),
    this.transaction.create({_id: `email#${params.email}`}),
    this.transaction.create({_id: `username#${params.username}`}),
  ]);
  const user = this.get({_id: createParams._id});
  return user;
});

userModel.methods.set("updateUser", async function (key, params) {
  const updateParams = {...omit(params, 'password')};
  if (!isEmpty(params.password)) {
    const inputPassword = params.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(inputPassword, salt);
    updateParams.password = hash;
  }
  const updateEmail = (!isEmpty(params.email)) ? true : false;
  const updatePhone = (!isEmpty(params.phone)) ? true : false;
  const updateUsername = (!isEmpty(params.username)) ? true : false;
  
  const prevUser = await this.get(key);
  await dynamoose.transaction(compact([
    this.transaction.update(key, updateParams),
    updatePhone && this.transaction.delete({_id: `phone#${prevUser.phone}`}),
    updatePhone && this.transaction.create({_id: `phone#${params.phone}`}),
    updateEmail && this.transaction.delete({_id: `email#${prevUser.email}`}),
    updateEmail && this.transaction.create({_id:`email#${params.email}`}),
    updateUsername && this.transaction.delete({_id: `username#${prevUser.username}`}),
    updateUsername && this.transaction.create({_id: `username#${params.username}`}),
  ]));
  const user = await this.get(key);
  return user;
});

module.exports = userModel;