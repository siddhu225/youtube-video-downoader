const mongoose =  require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    title: {
      type: String,
    },
    status: {
      type: String,
      enum: ['started', 'cancelled', 'done'],
    }, 
  },
  { timestamps: true },
);

module.exports = mongoose.model('video', videoSchema);