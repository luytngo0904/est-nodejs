const mongoose = require("mongoose");

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    created_by: {
      type: Number,
    },
    role_in_board : [
        {
            userID : {
              type : Number,
            },
            role : {
                type : String,
                default : "member"
            }
        }
    ]
}, {
    timestamps: true
});

boardSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

const Board = mongoose.model("board", boardSchema);
module.exports = Board;
