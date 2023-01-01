const { Schema, model } = require("mongoose");

const schedeulerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  for: String,
  turID: String,
  date: String,
  schedeulStas: Boolean,
});

module.exports = model("scheduler", schedeulerSchema, "Automation");
