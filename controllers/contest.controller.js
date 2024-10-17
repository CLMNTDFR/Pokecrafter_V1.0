const cron = require('node-cron');
const Contest = require('../models/contest.model');
const ArtworkContest = require('../models/artwork.contest.model');
const ObjectID = require("mongoose").Types.ObjectId;
const UserModel = require('../models/user.model'); // Assurez-vous que le chemin est correct

cron.schedule('1 0 * * *', async () => {
    console.log('Vérification des contests en cours...');
    try {
        const currentDate = new Date();
        // Rechercher les contests dont la date de fin est dépassée et qui ne sont pas encore fermés
        const contestsToEnd = await Contest.find({ endDate: { $lte: currentDate }, isCompleted: false }); // Ajout de isCompleted: false

        for (const contest of contestsToEnd) {
            console.log(`Attribution des trophées pour le contest ${contest._id}`);

            // Récupérer les artworks du contest
            const artworks = await ArtworkContest.find({ contestId: contest._id });

            // Trier les artworks par nombre de likes
            const sortedArtworks = artworks.sort((a, b) => b.likers.length - a.likers.length);

            // Vérifier s'il y a des artworks dans le contest
            if (sortedArtworks.length > 0) {
                // Attribution des trophées
                const creatorRole = contest.creatorRole;
                const trophies = ['gold-trophy', 'silver-trophy', 'bronze-trophy'];

                // Si le créateur est un super-admin, attribuer un trophée noir au gagnant
                if (creatorRole === 'super-admin') {
                    const winner = sortedArtworks[0].posterId;
                    const user = await UserModel.findById(winner);
                    if (user) {
                        user.trophies.push({ type: 'black-trophy' });
                        await user.save();
                        console.log(`Trophée noir attribué à l'utilisateur ${winner}`);
                    }
                } else {
                    // Attribuer les trophées aux trois premiers
                    for (let i = 0; i < Math.min(3, sortedArtworks.length); i++) {
                        const user = await UserModel.findById(sortedArtworks[i].posterId);
                        if (user) {
                            user.trophies.push({ type: trophies[i] });
                            await user.save();
                            console.log(`Trophée ${trophies[i]} attribué à l'utilisateur ${user._id}`);
                        }
                    }
                }
            } else {
                console.log(`Aucun artwork trouvé pour le contest ${contest._id}`);
            }

            // Marquer le contest comme terminé
            contest.isCompleted = true;
            await contest.save();  // Enregistrer la mise à jour
            console.log(`Contest ${contest._id} marqué comme terminé.`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'attribution des trophées:', error);
    }
});


module.exports.createContest = async (req, res) => {
    const { name, startDate, endDate, description } = req.body;

    // Vérifiez que l'utilisateur est authentifié et que ses informations sont présentes
    const { id: creatorId, role: creatorRole } = res.locals.user || {};
    if (!creatorId || !creatorRole) {
        return res.status(401).json({ message: "Unauthorized: Missing user information" });
    }

    const contest = new Contest({
        name,
        startDate,
        endDate,
        description,
        creatorRole, // Utilisez le rôle de l'utilisateur
        createdBy: creatorId // Utilisez l'ID de l'utilisateur
    });

    try {
        const savedContest = await contest.save();
        res.status(201).json(savedContest);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Contest creation failed", error: err });
    }
};


// Obtenir tous les contests
module.exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find().populate('artworks'); // Inclut les artworks dans les contests
        res.status(200).json(contests);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Obtenir un contest par son ID
module.exports.getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id).populate('artworks');
        if (!contest) return res.status(404).json({ message: 'Contest not found' });
        res.status(200).json(contest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
module.exports.updateContest = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Contient les données à mettre à jour

    try {
        const contest = await Contest.findByIdAndUpdate(id, updateData, { new: true });
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        res.status(200).json(contest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
module.exports.deleteContest = async (req, res) => {
    const { id } = req.params;

    try {
        const contest = await Contest.findByIdAndDelete(id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        res.status(200).json({ message: 'Contest deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.endContest = async (req, res) => {
    console.log('endContest function called');  // Log initial pour vérifier que la fonction est bien exécutée

    try {
        const contest = await Contest.findById(req.params.contestId);

        if (!contest) {
            console.log('Contest not found');  // Log pour confirmer que le contest existe ou non
            return res.status(404).json({ message: 'Contest not found' });
        }

        const currentDate = new Date();

        console.log('currentDate:', currentDate);  // Log de la date actuelle
        console.log('contestEndDate:', contest.endDate);  // Log de la date de fin du contest

        // Vérifie si le contest est déjà marqué comme terminé
        if (contest.isCompleted) {
            console.log('Contest already completed');  // Log si le contest est déjà terminé
            return res.status(400).json({ message: 'Contest already completed.' });
        }

        // Vérifie si la date actuelle dépasse la date de fin du contest
        if (currentDate < contest.endDate) {
            console.log('Contest not yet ended');  // Log si le contest n'est pas encore terminé
            return res.status(400).json({ message: "The contest hasn't ended yet." });
        }

        // Processus d'attribution des trophées
        const artworks = contest.artworks;
        if (artworks.length === 0) {
            console.log('No artworks found');  // Log si aucun artwork n'est trouvé
            return res.status(400).json({ message: 'No artworks in this contest.' });
        }

        // Attribuer les trophées ici
        console.log('Trophies are being awarded');  // Log indiquant que l'attribution est en cours

        // Marquer le contest comme terminé
        contest.isCompleted = true;  // Mise à jour du champ isCompleted
        await contest.save();  // Sauvegarder dans la base de données

        res.status(200).json({ message: 'Trophies awarded and contest marked as completed.' });
    } catch (error) {
        console.error('Error ending contest:', error);  // Log de l'erreur
        res.status(500).json({ message: 'Internal server error.' });
    }
};
