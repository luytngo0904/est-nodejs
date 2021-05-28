const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  role_id: {
    type: String,
    ref: "",
  },
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
