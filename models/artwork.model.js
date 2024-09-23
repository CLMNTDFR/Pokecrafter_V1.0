const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      required: true
    },
  //  picture: {
   //   type: String,
    //  required: true,
  //  },
    likers: {
      type: [String]
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: {
            type: String,
            trim: true,
            maxlength: 500
          },
          timestamp: {
            type: Date,
            default: Date.now
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Artwork', ArtworkSchema);