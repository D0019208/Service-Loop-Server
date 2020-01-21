const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  std_name: {
    type: String,
    required: true
  },
  std_email: {
    type: String,
    required: true
  },
  std_avatar: {
    type: String,
    required: true
  },
  post_title: {
    type: String,
    required: true
  },
  post_posted_on:
  {
    type: String,
    required: true
  },
  post_desc:
  {
    type: String,
    required: true
  },
  post_desc_trunc:
  {
    type: String,
    required: true
  },
  post_status:
  {
    type: String,
    required: true
  },
  post_modules:
  {
    type: Array,
    required: true
  },
  post_tut_assigned:
  {
    type: String
  },
  expire_at: {
    type: Date,
    default: Date.now, expires: 2505600
  }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;