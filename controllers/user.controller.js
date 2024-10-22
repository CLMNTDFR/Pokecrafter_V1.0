const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const ArtworkModel = require("../models/artwork.model");
const ArtworkContestModel = require("../models/artwork.contest.model");

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select("-password_hash");
    res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId).select("-password_hash");

        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.send(updatedUser);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // 1. Delete user
        await UserModel.findByIdAndDelete(userId);

        // 2. Delete all his artworks
        await ArtworkModel.deleteMany({ posterId: userId });
        await ArtworkContestModel.deleteMany({ posterId: userId });

        // 3. Delete all comments posted by the user
        await ArtworkModel.updateMany(
            {},
            { $pull: { comments: { commenterId: userId } } }
        );
        await ArtworkContestModel.updateMany(
            {},
            { $pull: { comments: { commenterId: userId } } }
        );

        // 4. Delete all the likes of the user
        await ArtworkModel.updateMany(
            {},
            { $pull: { likers: userId } }
        );
        await ArtworkContestModel.updateMany(
            {},
            { $pull: { likers: userId } }
        );

        // 5. Delete the ID of the user from the array of followers
        await UserModel.updateMany(
            {},
            { $pull: { followers: userId, following: userId } }
        );

        // response
        res.status(200).send({ message: "User and all related data deleted successfully." });

    } catch (err) {
        return res.status(500).send('Internal server error');
    }
};

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    try {
        const userFollowing = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true }
        );

        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        return res.status(201).json(userFollowing);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    try {
        const userUnfollowing = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true }
        );

        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        return res.status(201).json(userUnfollowing);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
