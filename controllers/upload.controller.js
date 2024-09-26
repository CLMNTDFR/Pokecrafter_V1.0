const UserModel = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
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

        const fileName = req.body.name + ".jpg"; // ou req.user.name si utilisateur connecté
        const filePath = path.join(__dirname, "../client/public/img/uploads/profil", fileName);
        console.log('Chemin du fichier:', filePath);

        // Déplacer le fichier
        file.mv(filePath, async (err) => {
            if (err) {
                console.error('Erreur lors du déplacement du fichier:', err);
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            try {
                console.log('Fichier déplacé avec succès');
                const updatedUser = await UserModel.findByIdAndUpdate(
                    req.body.userId, // ou req.user._id si authentifié
                    { $set: { picture: "./img/uploads/profil/" + fileName } },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
                console.log('Utilisateur mis à jour:', updatedUser);
                return res.status(200).json(updatedUser);
            } catch (err) {
                console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
                return res.status(500).json({ message: err.message });
            }
        });
    } catch (err) {
        console.error('Erreur capturée:', err);
        return res.status(400).json({ error: err.message });
    }
};
