const path = require('path');
const UserModel = require('../models/user.model');
const ArtworkContest = require('../models/artwork.contest.model');
const Contest = require('../models/contest.model');
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createArtworkContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.body.contestId);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Check the ending date of the contest
        const currentDate = new Date();
        if (currentDate > contest.endDate) {
            return res.status(400).json({ message: "The contest has already ended. You cannot submit an artwork." });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            throw Error("No file uploaded");
        }

        const file = req.files.file;

        // Checking the MIME
        const validMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw Error("invalid file");
        }

        if (file.size > 500000) {
            throw Error("max size");
        }

        const timestamp = Date.now();
        const fileName = `Pokecrafter_contest_${req.body.contestId}_${req.body.posterId}_${timestamp}.jpg`;
        const filePath = path.join(__dirname, "../client/public/img/uploads/artwork_contest", fileName);

        file.mv(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            try {
                const newArtworkContest = new ArtworkContest({
                    posterId: req.body.posterId,
                    contestId: req.body.contestId,
                    title: req.body.title,
                    description: req.body.description,
                    picture: "./img/uploads/artwork_contest/" + fileName,
                    likers: [],
                    comments: [],
                });

                const artworkContest = await newArtworkContest.save();

                contest.artworks.push(artworkContest._id);
                await contest.save();

                return res.status(201).json(artworkContest);
            } catch (err) {
                return res.status(400).send(err);
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports.getArtworksByContestId = async (req, res) => {
  const { contestID } = req.params;

  try {
      const artworks = await ArtworkContest.find({ contestId: contestID });
      if (!artworks.length) {
          return res.status(404).json({ message: 'No artworks found for this contest' });
      }

      res.status(200).json(artworks);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};


module.exports.updateArtworkContest = async (req, res) => {
    const { id } = req.params;
  
    if (!ObjectID.isValid(id)) {
      return res.status(400).send("ID unknown: " + id);
    }
  
    const updatedRecord = {
      title: req.body.title,
      description: req.body.description,
      photo: req.body.photo,
    };
  
    try {
      const updatedArtwork = await ArtworkContest.findByIdAndUpdate(
        id,
        { $set: updatedRecord },
        { new: true }
      );
  
      if (!updatedArtwork) {
        return res.status(404).send("Artwork contest not found");
      }

      res.status(200).json(updatedArtwork);
    } catch (err) {
      res.status(500).send(err);
    }
  };

module.exports.deleteArtworkContest = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedArtwork = await ArtworkContest.findByIdAndDelete(id);
        if (!deletedArtwork) return res.status(404).json({ message: 'Artwork not found' });

        res.status(200).json({ message: 'Artwork deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.getArtworkContestById = async (req, res) => {
    const { id } = req.params;

    try {
        const artwork = await ArtworkContest.findById(id);
        if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

        res.status(200).json(artwork);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.likeArtworkContest = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    try {
      const artworkContest = await ArtworkContest.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true }
      );
      
      if (!artworkContest) return res.status(404).send("Artwork Contest not found");

      const user = await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true }
      );
      
      if (!user) return res.status(404).send("User not found");
  
      return res.status(200).send(artworkContest);
  
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  module.exports.unlikeArtworkContest = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    try {
      const artworkContest = await ArtworkContest.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true }
      );
      
      if (!artworkContest) return res.status(404).send("Artwork Contest not found");
  
      const user = await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true }
      );
      
      if (!user) return res.status(404).send("User not found");
  
      return res.status(200).send(artworkContest);
  
    } catch (err) {
      return res.status(400).send(err);
    }
  };

module.exports.commentArtworkContest = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown: " + req.params.id);
    }

    try {
        const updatedArtwork = await ArtworkContest.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true }
        );

        if (!updatedArtwork) {
            return res.status(404).send("Artwork not found");
        }

        return res.status(200).send(updatedArtwork);
    } catch (err) {
        return res.status(500).send({ error: "Internal server error", details: err });
    }
};

module.exports.editCommentArtworkContest = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown: " + req.params.id);
    }

    try {
        const artwork = await ArtworkContest.findById(req.params.id);
        const comment = artwork.comments.find(c => c._id.equals(req.body.commentId));

        if (!comment) return res.status(404).send("Comment not found");

        comment.text = req.body.text;

        await artwork.save();
        res.status(200).send(artwork);
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports.deleteCommentArtworkContest = async (req, res) => {
    const { id } = req.params;
    const { commentId } = req.body;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send("ID unknown: " + id);
    }

    if (!ObjectID.isValid(commentId)) {
        return res.status(400).send("Comment ID unknown: " + commentId);
    }

    try {
        const artwork = await ArtworkContest.findById(id);

        if (!artwork) {
            return res.status(404).send("Artwork not found");
        }

        const commentIndex = artwork.comments.findIndex(comment => comment._id.equals(commentId));

        if (commentIndex === -1) {
            return res.status(404).send("Comment not found");
        }

        artwork.comments.splice(commentIndex, 1);

        await artwork.save();

        res.status(200).json(artwork);
    } catch (err) {
        res.status(500).send("Internal server error");
    }
};
