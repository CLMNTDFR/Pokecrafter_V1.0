const cron = require('node-cron');
const Contest = require('../models/contest.model');
const ArtworkContest = require('../models/artwork.contest.model');
const UserModel = require('../models/user.model');

cron.schedule('1 0 * * *', async () => {
    try {
        const currentDate = new Date();
        const contestsToEnd = await Contest.find({ endDate: { $lte: currentDate }, isCompleted: false });

        for (const contest of contestsToEnd) {
            const artworks = await ArtworkContest.find({ contestId: contest._id });
            const sortedArtworks = artworks.sort((a, b) => b.likers.length - a.likers.length);

            if (sortedArtworks.length > 0) {
                const creatorRole = contest.creatorRole;
                const trophies = ['gold-trophy', 'silver-trophy', 'bronze-trophy'];

                if (creatorRole === 'super-admin') {
                    const winner = sortedArtworks[0].posterId;
                    const user = await UserModel.findById(winner);
                    if (user) {
                        user.trophies.push({ type: 'black-trophy' });
                        await user.save();
                    }
                } else {
                    for (let i = 0; i < Math.min(3, sortedArtworks.length); i++) {
                        const user = await UserModel.findById(sortedArtworks[i].posterId);
                        if (user) {
                            user.trophies.push({ type: trophies[i] });
                            await user.save();
                        }
                    }
                }
            }

            contest.isCompleted = true;
            await contest.save();
        }
    } catch (error) {
        console.error('Erreur lors de l\'attribution des trophées:', error);
    }
});


module.exports.createContest = async (req, res) => {
    const { name, startDate, endDate, description } = req.body;
    const { id: creatorId, role: creatorRole } = res.locals.user || {};
    if (!creatorId || !creatorRole) {
        return res.status(401).json({ message: "Unauthorized: Missing user information" });
    }

    const contest = new Contest({
        name,
        startDate,
        endDate,
        description,
        creatorRole,
        createdBy: creatorId
    });

    try {
        const savedContest = await contest.save();
        res.status(201).json(savedContest);
    } catch (err) {
        res.status(400).json({ message: "Contest creation failed", error: err });
    }
};


module.exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find().populate('artworks');
        res.status(200).json(contests);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

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
    const updateData = req.body;

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
    try {
        const contest = await Contest.findById(req.params.contestId);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        const currentDate = new Date();

        if (contest.isCompleted) {
            return res.status(400).json({ message: 'Contest already completed.' });
        }

        if (currentDate < contest.endDate) {
            return res.status(400).json({ message: "The contest hasn't ended yet." });
        }

        const artworks = contest.artworks;
        if (artworks.length === 0) {
            return res.status(400).json({ message: 'No artworks in this contest.' });
        }

        contest.isCompleted = true;
        await contest.save();

        res.status(200).json({ message: 'Trophies awarded and contest marked as completed.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};
