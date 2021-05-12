const mongoose = require("mongoose");
const { Schema } = mongoose;

const testSchema = new Schema({
  title: String,
  date: { type: Date, default: Date.now },
});

testSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Test = mongoose.model("test", testSchema);

module.exports = Test;
