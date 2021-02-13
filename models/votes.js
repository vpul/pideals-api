const mongoose = require('mongoose');

const voteSchema = mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId }, // could be deal or comment
    userId: { type: mongoose.Schema.Types.ObjectId },
    type: { type: Number, required: true, enum: [1, -1] }, // +1 or -1
  },
  { timestamps: true },
);

module.exports = mongoose.model('Vote', voteSchema);
