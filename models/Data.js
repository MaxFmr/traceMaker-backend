const mongoose = require("mongoose");

const Data = mongoose.model("Data", {
  batch: { type: Object },
});

module.exports = Data;
