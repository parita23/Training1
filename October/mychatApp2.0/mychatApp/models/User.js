const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String
    },
    password: {
        type:String
    }
  },
  {
    timestamps: true
  }
);

let user = mongoose.model("theuser", userSchema);

module.exports = user;
