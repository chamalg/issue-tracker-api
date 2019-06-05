const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
  age: { type: Number, default: 1 }
});

module.exports = mongoose.model("User", userSchema);
