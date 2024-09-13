const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select("-password_hash");
    res.status(200).json(users);
  };

module.exports.userInfo = async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id).select("-password_hash");
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (err) {
      console.error("ID unknown : " + err);
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
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID unknown : " + req.params.id);
    }
  
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Successfully deleted." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
      return res.status(400).send("ID unknown : " + req.params.id);
    }
  
    try {
      // Ajouter à la liste de "following"
      const userFollowing = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { following: req.body.idToFollow } },
        { new: true, upsert: true }
      );
  
      // Ajouter à la liste de "followers"
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
      // Supprimer de la liste de "following"
      const userUnfollowing = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { following: req.body.idToUnfollow } },
        { new: true, upsert: true }
      );
  
      // Supprimer de la liste de "followers"
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
  


  