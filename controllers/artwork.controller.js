const ArtworkModel = require("../models/artwork.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

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
  

  module.exports.createArtwork = async (req, res) => {
    const newArtwork = new ArtworkModel({
        posterId: req.body.posterId,
        title: req.body.title,
        description: req.body.description,
        likers: [],
        comments: [],
        // picture:
    });

    try {
        const Artwork = await newArtwork.save();
        return res.status(201).json(Artwork);

    }   catch (err) {
        return res.status(400).send(err);

    }

  }

  module.exports.updateArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    const updatedRecord = {
      title: req.body.title,
      description: req.body.description,
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
      console.log("Update error: " + err);
      res.status(500).send(err);
    }
  };

  module.exports.deleteArtwork = async (req, res) => {
    const { id } = req.params;
  
    // Vérifier si l'ID est valide
    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
  
    try {
      // Supprimer l'artwork par ID
      const deletedArtwork = await ArtworkModel.findByIdAndDelete(id);
  
      // Vérifier si l'artwork a été trouvé et supprimé
      if (!deletedArtwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }
  
      // Répondre avec l'artwork supprimé
      res.status(200).json({ message: "Artwork deleted successfully", artwork: deletedArtwork });
    } catch (err) {
      // Gérer les erreurs
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  };

  module.exports.likeArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    try {
      // Ajout de l'utilisateur à la liste des "likers" de l'artwork
      const artwork = await ArtworkModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true }
      );
      
      if (!artwork) return res.status(404).send("Artwork not found");
  
      // Ajout de l'artwork à la liste des "likes" de l'utilisateur
      const user = await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true }
      );
      
      if (!user) return res.status(404).send("User not found");
  
      return res.status(200).send(artwork);  // Ou tu peux renvoyer 'user' selon le besoin
  
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  module.exports.unlikeArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown: " + req.params.id);
  
    try {
      // Suppression de l'utilisateur des "likers" de l'artwork
      const artwork = await ArtworkModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true }
      );
  
      if (!artwork) return res.status(404).send("Artwork not found");
  
      // Suppression de l'artwork des "likes" de l'utilisateur
      const user = await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true }
      );
  
      if (!user) return res.status(404).send("User not found");
  
      return res.status(200).send(artwork);  // Ou tu peux aussi renvoyer 'user' selon le besoin
  
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  module.exports.commentArtwork = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID unknown: " + req.params.id);
    }
  
    try {
      // Ajout d'un commentaire au tableau "comments" de l'artwork
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
      console.error("Delete comment error:", err);
      res.status(500).send("Internal server error");
    }
  };