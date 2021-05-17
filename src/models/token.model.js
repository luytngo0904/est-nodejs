const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
    userID : {
        type : Schema.Types.ObjectId,
        ref : "user"
    },
    token : {
        type : String
    },
    deletedAt : {
        type : Date,
        default : Date.now()
    }
}, {
    timestamps : true
});

tokenSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
