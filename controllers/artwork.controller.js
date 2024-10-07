const ArtworkModel = require("../models/artwork.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const path = require("path");  // Ajout de path si tu l'utilises

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
    try {
        console.log('Début de l\'upload');
        console.log('req.files:', req.files);  // Vérifie si les fichiers sont présents
        console.log('req.body:', req.body);    // Vérifie si les données du corps sont présentes

        // Vérifie la présence de fichiers
        if (!req.files || Object.keys(req.files).length === 0) {
            console.error('Aucun fichier uploadé');
            throw Error("No file uploaded");
        }

        const file = req.files.file;  // Assurez-vous que "file" correspond au champ dans le formulaire
        console.log('Détails du fichier:', file); // Affiche les détails du fichier

        // Vérification du type MIME
        const validMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
        if (!validMimeTypes.includes(file.mimetype)) {
            console.error('Type MIME invalide:', file.mimetype);
            throw Error("invalid file");
        }

        // Limite de taille du fichier
        if (file.size > 500000) {
            console.error('Taille du fichier trop grande:', file.size);
            throw Error("max size");
        }

        const timeStamp = Date.now();
        const fileName = "Pokecrafter_" + req.body.category + "_" + req.body.posterId + timeStamp +".jpg";
        const filePath = path.join(__dirname, "../client/public/img/uploads/artworks", fileName);
        console.log('Chemin du fichier:', filePath);

        // Déplacer le fichier
        file.mv(filePath, async (err) => {
            if (err) {
                console.error('Erreur lors du déplacement du fichier:', err);
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            try {
                console.log('Fichier déplacé avec succès');
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
        console.error('Erreur capturée:', err);
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