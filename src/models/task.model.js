const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    task_index: {
      type: Number,
      required: true,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    list_id: {
      type: Schema.Types.ObjectId,
      ref: "list",
    },
  },
  { timestamps: true }
);
taskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
