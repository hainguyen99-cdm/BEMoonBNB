let mongoose = require("mongoose");
const role = require("./enum/role");


let OrderSchema = new mongoose.Schema({
  idLive: {type: String, required:false},
  amount:{type: String, required:false},
  time:{type: Number, required: false},
  status:{type: String, required:false},
  active: {type: Boolean, required: false,default:false},

}, {timestamps: true})

var Orders = mongoose.model("orders", OrderSchema)
module.exports = { Orders }