const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const url = "mongodb://admin:admin@localhost:27017/admin";

const connect = mongoose.connect(url, { useNewUrlParser: true });
module.exports = connect;