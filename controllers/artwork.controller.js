const ArtworkModel = require("../models/artwork.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const path = require("path");

module.exports.readArtwork = async (req, res) => {
    try {
        const artwork = await ArtworkModel.find()
            .sort({ createdAt: -1 })
            .lean()
            .exec();
  
        artwork.forEach(art => {
            art.comments = art.comments.sort((a, b) => b.timestamp - a.timestamp);
        });
  
        res.status(200).json(artwork);
    } catch (err) {
        res.status(400).json({ message: err });
    }
};

module.exports.readArtworkById = async (req, res) => {
  const { id } = req.params;

  try {
      const artwork = await ArtworkModel.findById(id).lean().exec();
      if (!artwork) {
          return res.status(404).json({ message: "Artwork not found" });
      }

      artwork.comments = artwork.comments.sort((a, b) => b.timestamp - a.timestamp);

      res.status(200).json(artwork);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};
  
module.exports.createArtwork = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw Error("No file uploaded");
        }

        const file = req.files.file;

        const validMimeTypes = ["image/jpg", "image/jpeg"];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw Error("invalid file");
        }
        if (file.size > 500000) {
            throw Error("max size");
        }

        const timeStamp = Date.now();
        const fileName = "Pokecrafter_" + req.body.category + "_" + req.body.posterId + timeStamp + ".jpg";
        const filePath = path.join(__dirname, "../client/public/img/uploads/artworks", fileName);

        file.mv(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            try {
                const newArtwork = new ArtworkModel({
                    posterId: req.body.posterId,
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                    likers: [],
                    comments: [],
                    picture: "./img/uploads/artworks/" + fileName,
                });

                const artwork = await newArtwork.save();
                return res.status(201).json(artwork);
            } catch (err) {
                return res.status(400).send(err);
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports.updateArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    const updatedRecord = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
    };
  
    try {
      const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true }
      );
  
      if (!updatedArtwork) {
        return res.status(404).send("Artwork not found");
      }
  
      res.status(200).json(updatedArtwork);
    } catch (err) {
      res.status(500).send(err);
    }
};

module.exports.deleteArtwork = async (req, res) => {
    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
  
    try {
      const deletedArtwork = await ArtworkModel.findByIdAndDelete(id);
  
      if (!deletedArtwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }

      res.status(200).json({ message: "Artwork deleted successfully", artwork: deletedArtwork });
    } catch (err) {
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

module.exports.likeArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    try {
      const artwork = await ArtworkModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likers: req.body.id } },
        { new: true }
      );
      
      if (!artwork) return res.status(404).send("Artwork not found");
  
      const user = await UserModel.findByIdAndUpdate(
        req.body.id,
        { $addToSet: { likes: req.params.id } },
        { new: true }
      );
      
      if (!user) return res.status(404).send("User not found");
  
      return res.status(200).send(artwork);
    } catch (err) {
      return res.status(400).send(err);
    }
};

module.exports.unlikeArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    try {
      const artwork = await ArtworkModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { likers: req.body.id } },
        { new: true }
      );
  
      if (!artwork) return res.status(404).send("Artwork not found");
  
      const user = await UserModel.findByIdAndUpdate(
        req.body.id,
        { $pull: { likes: req.params.id } },
        { new: true }
      );
  
      if (!user) return res.status(404).send("User not found");
  
      return res.status(200).send(artwork);
    } catch (err) {
      return res.status(400).send(err);
    }
};

module.exports.commentArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID unknown: " + req.params.id);
    }
  
    try {
      const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
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
  
module.exports.editCommentArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      const artwork = await ArtworkModel.findById(req.params.id);
      const comment = artwork.comments.find(c => c._id.equals(req.body.commentId));
  
      if (!comment) return res.status(404).send("Comment not found");
  
      comment.text = req.body.text;
  
      await artwork.save();
      res.status(200).send(artwork);
    } catch (err) {
      res.status(400).send(err);
    }
};

module.exports.deleteCommentArtwork = async (req, res) => {
    const { id } = req.params;
    const { commentId } = req.body;
  
    if (!ObjectID.isValid(id)) {
      return res.status(400).send("ID unknown : " + id);
    }
  
    if (!ObjectID.isValid(commentId)) {
      return res.status(400).send("Comment ID unknown : " + commentId);
    }
  
    try {
      const artwork = await ArtworkModel.findById(id);
  
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
