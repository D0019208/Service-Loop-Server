const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notification_avatar: {
    type: String,
    required: true
  },
  notification_title: {
    type: String,
    required: true
  },
  notification_desc:
  {
      type: String,
      required: true
  },
  notification_desc_trunc:
  {
      type: String,
      required: true
  },
  notification_posted_on: 
  {
    type: Date,
    required: true
  },
  notification_opened: {
    type: Boolean,
    required: true,
    default: false
  },
  notification_tags: {
    type: Array,
    required: true
  },
  notification_modules: {
    type: Array
  },
  post_id:
  {
      type: String
  },
  std_email: 
  {
    type: String
  }
});

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;