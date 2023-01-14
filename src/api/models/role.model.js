const dynamoose = require("dynamoose");

const roleSchema = new dynamoose.Schema({
  _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    default: (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
      s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
  },
  name: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    unique: true,
    required: true,
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

const roleModel = dynamoose.model("Authy-Role", roleSchema);

module.exports = roleModel;