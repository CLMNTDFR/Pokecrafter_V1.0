const path = require('path');
const UserModel = require('../models/user.model'); // Assurez-vous que le chemin est correct
const ArtworkContest = require('../models/artwork.contest.model');  // Assurez-vous que le chemin est correct
const Contest = require('../models/contest.model');  // Assurez-vous que le chemin est correct
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createArtworkContest = async (req, res) => {
    try {
        console.log('Début de l\'upload d\'artwork pour le contest');
        console.log('req.files:', req.files);  // Vérifie si les fichiers sont présents
        console.log('req.body:', req.body);    // Vérifie si les données du corps sont présentes

        // Vérification si le contest existe
        const contest = await Contest.findById(req.body.contestId);
        if (!contest) {
            console.error('Contest non trouvé:', req.body.contestId);
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Vérification de la date de fin du contest
        const currentDate = new Date();
        if (currentDate > contest.endDate) {
            console.error('Le contest est terminé, la date de fin est dépassée');
            return res.status(400).json({ message: "The contest has already ended. You cannot submit an artwork." });
        }

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

        // Formater le nom du fichier pour le contest
        const fileName = "Pokecrafter_contest_" + req.body.contestId + "_" + req.body.posterId + ".jpg";
        const filePath = path.join(__dirname, "../client/public/img/uploads/artwork_contest", fileName);
        console.log('Chemin du fichier:', filePath);

        // Déplacer le fichier
        file.mv(filePath, async (err) => {
            if (err) {
                console.error('Erreur lors du déplacement du fichier:', err);
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            try {
                console.log('Fichier déplacé avec succès');
                const newArtworkContest = new ArtworkContest({
                    posterId: req.body.posterId,
                    contestId: req.body.contestId,
                    title: req.body.title,
                    description: req.body.description,
                    picture: "./img/uploads/artwork_contest/" + fileName,
                    likers: [],
                    comments: [],
                });

                // Sauvegarder le nouvel artwork pour le contest
                const artworkContest = await newArtworkContest.save();

                // Ajouter cet artwork au contest
                contest.artworks.push(artworkContest._id);  // Ajouter l'artwork au contest
                await contest.save();

                return res.status(201).json(artworkContest);
            } catch (err) {
                console.error('Erreur lors de la sauvegarde de l\'artwork pour le contest:', err);
                return res.status(400).send(err);
            }
        });
    } catch (err) {
        console.error('Erreur capturée:', err);
        return res.status(400).json({ error: err.message });
    }
};

module.exports.getArtworksByContestId = async (req, res) => {
  const { contestID } = req.params; // "contestID" correspond à ce qui est dans la route

  try {
      const artworks = await ArtworkContest.find({ contestId: contestID }); // Utilise contestID
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
  
    // Vérifier si l'ID est valide
    if (!ObjectID.isValid(id)) {
      return res.status(400).send("ID unknown: " + id);
    }
  
    // Définir les champs modifiables
    const updatedRecord = {
      title: req.body.title,
      description: req.body.description,
      photo: req.body.photo,  // Ici tu stockes directement le chemin ou l'URL de la photo
    };
  
    try {
      // Mise à jour du ArtworkContest
      const updatedArtwork = await ArtworkContest.findByIdAndUpdate(
        id,
        { $set: updatedRecord },
        { new: true }
      );
  
      // Si l'ArtworkContest n'existe pas
      if (!updatedArtwork) {
        return res.status(404).send("Artwork contest not found");
      }
  
      // Renvoie les données mises à jour
      res.status(200).json(updatedArtwork);
    } catch (err) {
      console.log("Update error: " + err);
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
      // Ajout de l'utilisateur à la liste des "likers" de l'artwork contest
      const artworkContest = await ArtworkContest.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true }
      );
      
      if (!artworkContest) return res.status(404).send("Artwork Contest not found");
  
      // Ajout de l'artwork contest à la liste des "likes" de l'utilisateur
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
      // Suppression de l'utilisateur des "likers" de l'artwork contest
      const artworkContest = await ArtworkContest.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true }
      );
      
      if (!artworkContest) return res.status(404).send("Artwork Contest not found");
  
      // Suppression de l'artwork contest des "likes" de l'utilisateur
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

// Fonction pour commenter un artwork contest
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

// Fonction pour éditer un commentaire d'un artwork contest
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

// Fonction pour supprimer un commentaire d'un artwork contest
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
        console.error("Delete comment error:", err);
        res.status(500).send("Internal server error");
    }
};
