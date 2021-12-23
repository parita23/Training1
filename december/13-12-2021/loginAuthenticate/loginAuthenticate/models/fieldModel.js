const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    field: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("fields", tableSchema);
