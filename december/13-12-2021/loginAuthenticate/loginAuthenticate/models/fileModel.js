const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    skipFirstRow: {
      type: String,
      default:"false"
    },
    fieldMappingObject: {
      type: Object,
      default:null
    },
    totalRecords: {
      type: String,
      default:0
    },
    duplicates: {
      type: String,
      default:0
    },
    discarded: {
        type: String,
        default:0
    },
    totalUploaded: {
        type: String,
        default:0
     },
    uploadedBy : {
        type: String,
    },
    status : {
        type: String,
        enum:['pending','inProgress','uploaded'],
        default:'pending'
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("files", tableSchema);
