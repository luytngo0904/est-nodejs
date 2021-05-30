const mongoose = require("mongoose");

const { Schema } = mongoose;

const teamBoardSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    member : [
        {
          userID : Number,
          role  : {
            type : String,
            default : "member"
          }
        }
    ]
}, {
    timestamps: true
});

teamBoardSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

const TeamBoard = mongoose.model("teamBoard", teamBoardSchema);
module.exports = TeamBoard;
