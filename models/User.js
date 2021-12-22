const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    required: true,
    type: String,
  },

  password: { type: String },

  apiAccount: {
    apiEmail: { required: true, type: String },
    apiEncryptPassword: { required: true, type: String },
  },
  apiHeader: { required: true, type: String },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
