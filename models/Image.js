let mongoose = require("mongoose");
const role = require("./enum/role");


let ImageSchema = new mongoose.Schema({
  Image: {type: String, required:false}
}, {timestamps: true})

var Images = mongoose.model("orders", ImageSchema)
module.exports = { Images }