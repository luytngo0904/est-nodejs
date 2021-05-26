const mongoose = require("mongoose");
const {Schema} = mongoose;

const listSchema = new Schema({
    list_index:{
        type:Number,
        required:true,
        default:0
    },
    name:{
        type:String,
        required:true
    },
    board_id:{
        type:String,
        ref:"board"
    }
},
    {timestamps:true}
)
listSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
  
  const List = mongoose.model("list", listSchema);
  
  module.exports = List;