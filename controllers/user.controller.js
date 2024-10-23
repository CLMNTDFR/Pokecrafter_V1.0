// Import necessary models and MongoDB ObjectID type
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const ArtworkModel = require("../models/artwork.model");
const ArtworkContestModel = require("../models/artwork.contest.model");

// Fetch all users while excluding their password hashes
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select("-password_hash"); // Don't send password hashes
    res.status(200).json(users); // Respond with the list of users
};

// Get user information by their ID
module.exports.userInfo = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId).select("-password_hash"); // Exclude password hashes
        
        if (user) {
            res.send(user); // Send the user data if found
        } else {
            res.status(404).send({ message: "User not found" }); // Send error if user not found
        }
    } catch (err) {
        res.status(500).send({ message: "Server error" }); // Handle server errors
    }
};

// Update user bio by their ID
module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id); // Validate user ID

    try {
        // Find the user and update their bio
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio, // Set the new bio
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send("User not found"); // Handle if user not found
        }

        res.send(updatedUser); // Respond with the updated user
    } catch (err) {
        return res.status(500).json({ message: err.message }); // Handle server errors
    }
};

// Delete a user and all related data
module.exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found'); // If user doesn't exist, send 404
        }

        // 2. Delete the user
        await UserModel.findByIdAndDelete(userId);

        // 3. Delete all the user's artworks and contest artworks
        await ArtworkModel.deleteMany({ posterId: userId });
        await ArtworkContestModel.deleteMany({ posterId: userId });

        // 4. Remove all comments posted by the user on any artwork
        await ArtworkModel.updateMany(
            {},
            { $pull: { comments: { commenterId: userId } } } // Pull the comments from all artworks
        );
        await ArtworkContestModel.updateMany(
            {},
            { $pull: { comments: { commenterId: userId } } }
        );

        // 5. Remove all likes given by the user
        await ArtworkModel.updateMany(
            {},
            { $pull: { likers: userId } } // Pull user ID from 'likers' array
        );
        await ArtworkContestModel.updateMany(
            {},
            { $pull: { likers: userId } }
        );

        // 6. Remove the user from all followers and following lists
        await UserModel.updateMany(
            {},
            { $pull: { followers: userId, following: userId } } // Remove user ID from both arrays
        );

        // Respond with success message
        res.status(200).send({ message: "User and all related data deleted successfully." });

    } catch (err) {
        return res.status(500).send('Internal server error'); // Handle server errors
    }
};

// Follow another user
module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send("ID unknown : " + req.params.id); // Validate both user IDs
    }

    try {
        // 1. Add the followed user's ID to the current user's "following" list
        const userFollowing = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } }, // Use $addToSet to avoid duplicates
            { new: true, upsert: true }
        );

        // 2. Add the current user's ID to the followed user's "followers" list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        return res.status(201).json(userFollowing); // Return the updated "following" list
    } catch (err) {
        return res.status(500).json({ message: err.message }); // Handle server errors
    }
};

// Unfollow a user
module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)) {
        return res.status(400).send("ID unknown : " + req.params.id); // Validate both user IDs
    }

    try {
        // 1. Remove the unfollowed user's ID from the current user's "following" list
        const userUnfollowing = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } }, // Use $pull to remove from array
            { new: true, upsert: true }
        );

        // 2. Remove the current user's ID from the unfollowed user's "followers" list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        return res.status(201).json(userUnfollowing); // Return the updated "following" list
    } catch (err) {
        return res.status(500).json({ message: err.message }); // Handle server errors
    }
};
