const Contest = require('../models/contest.model');
const ArtworkContest = require('../models/artwork.contest.model');
const ObjectID = require("mongoose").Types.ObjectId;

// Créer un nouveau contest
module.exports.createContest = async (req, res) => {
    const { name, description, startDate, endDate } = req.body;

    try {
        const newContest = new Contest({
            name,
            description,
            startDate,
            endDate
        });

        await newContest.save();
        res.status(201).json(newContest);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
