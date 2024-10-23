const mongoose = require('mongoose');

// Define the Artwork Contest model. (Artworks that you can only find in a Contest)

const ArtworkContestSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    contestId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Contest' },
    
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
    picture: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model('ArtworkContest', ArtworkContestSchema);