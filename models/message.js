const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;
//Schema
const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message_title: { type: String, required: true, minLength: 1, maxLength: 50 },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});
//Virtual
MessageSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("yyyy-MM-dd, HH:mm");
});

//Export model

module.exports = mongoose.model("Message", MessageSchema);
