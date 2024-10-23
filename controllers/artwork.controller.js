const ArtworkModel = require("../models/artwork.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const path = require("path");

module.exports.readArtwork = async (req, res) => {
  try {
      const artwork = await ArtworkModel.find()
          .sort({ createdAt: -1 }) // Sort artworks by creation date, latest first
          .lean()
          .exec();

      artwork.forEach(art => {
          art.comments = art.comments.sort((a, b) => b.timestamp - a.timestamp); // Sort comments by timestamp, latest first
      });

      res.status(200).json(artwork); // Send sorted artworks with comments
  } catch (err) {
      res.status(400).json({ message: err }); // Handle any errors
  }
};

// Function to retrieve a single artwork by its ID and sort its comments by timestamp
module.exports.readArtworkById = async (req, res) => {
const { id } = req.params;

try {
    const artwork = await ArtworkModel.findById(id).lean().exec(); // Fetch artwork by ID
    if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" }); // If no artwork is found, send a 404 response
    }

    artwork.comments = artwork.comments.sort((a, b) => b.timestamp - a.timestamp); // Sort comments by timestamp

    res.status(200).json(artwork); // Send the artwork with sorted comments
} catch (err) {
    res.status(400).json({ message: err.message }); // Handle any errors
}
};

// Function to create a new artwork, validating file upload and saving it to the server
module.exports.createArtwork = async (req, res) => {
  try {
      if (!req.files || Object.keys(req.files).length === 0) {
          throw Error("No file uploaded"); // Check if a file is uploaded
      }

      const file = req.files.file;

      // Check if the uploaded file is a valid image
      const validMimeTypes = ["image/jpg", "image/jpeg"];
      if (!validMimeTypes.includes(file.mimetype)) {
          throw Error("invalid file");
      }
      if (file.size > 500000) {
          throw Error("max size");
      }

      // Generate the file name and define the file path
      const timeStamp = Date.now();
      const fileName = "Pokecrafter_" + req.body.category + "_" + req.body.posterId + timeStamp + ".jpg";
      const filePath = path.join(__dirname, "../client/public/img/uploads/artworks", fileName);

      // Move the uploaded file to the destination path
      file.mv(filePath, async (err) => {
          if (err) {
              return res.status(500).json({ message: "File upload failed", error: err });
          }

          try {
              // Create the artwork object and save it to the database
              const newArtwork = new ArtworkModel({
                  posterId: req.body.posterId,
                  title: req.body.title,
                  description: req.body.description,
                  category: req.body.category,
                  likers: [],
                  comments: [],
                  picture: "./img/uploads/artworks/" + fileName, // Store the image path
              });

              const artwork = await newArtwork.save(); // Save artwork to the database
              return res.status(201).json(artwork); // Respond with the saved artwork
          } catch (err) {
              return res.status(400).send(err); // Handle errors during saving
          }
      });
  } catch (err) {
      return res.status(400).json({ error: err.message }); // Handle file upload errors
  }
};

// Function to update an existing artwork's title, description, and category
module.exports.updateArtwork = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown: " + req.params.id); // Validate artwork ID

  const updatedRecord = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category, // Prepare the updated fields
  };

  try {
    const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord }, // Update artwork with new data
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).send("Artwork not found"); // If artwork not found, return 404
    }

    res.status(200).json(updatedArtwork); // Send back the updated artwork
  } catch (err) {
    res.status(500).send(err); // Handle errors during update
  }
};

// Function to delete an artwork by its ID
module.exports.deleteArtwork = async (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" }); // Validate artwork ID format
  }

  try {
    const deletedArtwork = await ArtworkModel.findByIdAndDelete(id); // Delete artwork by ID

    if (!deletedArtwork) {
      return res.status(404).json({ error: "Artwork not found" }); // If no artwork is found, return 404
    }

    res.status(200).json({ message: "Artwork deleted successfully", artwork: deletedArtwork }); // Respond with success message
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message }); // Handle errors during deletion
  }
};

// Function to like an artwork, adding the user's ID to both artwork's likers array and user's likes array
module.exports.likeArtwork = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown: " + req.params.id); // Validate artwork ID

  try {
    const artwork = await ArtworkModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } }, // Add the user ID to the likers array
      { new: true }
    );
    
    if (!artwork) return res.status(404).send("Artwork not found"); // Return 404 if no artwork found

    const user = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } }, // Add the artwork ID to the user's likes array
      { new: true }
    );
    
    if (!user) return res.status(404).send("User not found"); // Return 404 if no user found

    return res.status(200).send(artwork); // Respond with the updated artwork
  } catch (err) {
    return res.status(400).send(err); // Handle errors during liking
  }
};

// Function to unlike an artwork, removing the user's ID from both artwork's likers array and user's likes array
module.exports.unlikeArtwork = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown: " + req.params.id); // Validate artwork ID

  try {
    const artwork = await ArtworkModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } }, // Remove the user ID from the likers array
      { new: true }
    );

    if (!artwork) return res.status(404).send("Artwork not found"); // Return 404 if no artwork found

    const user = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } }, // Remove the artwork ID from the user's likes array
      { new: true }
    );

    if (!user) return res.status(404).send("User not found"); // Return 404 if no user found

    return res.status(200).send(artwork); // Respond with the updated artwork
  } catch (err) {
    return res.status(400).send(err); // Handle errors during unliking
  }
};

// Function to comment on an artwork by pushing a new comment object into the artwork's comments array
module.exports.commentArtwork = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id); // Validate artwork ID
  }

  try {
    const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId, // ID of the commenter
            commenterPseudo: req.body.commenterPseudo, // Pseudo of the commenter
            text: req.body.text, // Comment text
            timestamp: new Date().getTime(), // Current timestamp
          },
        },
      },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).send("Artwork not found"); // Return 404 if no artwork found
    }

    return res.status(200).send(updatedArtwork); // Respond with the updated artwork
  } catch (err) {
    return res.status(500).send({ error: "Internal server error", details: err }); // Handle errors during commenting
  }
};
  // Updates a specific artwork's comment.
// Validates artwork ID and updates the comment text if found.
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

// Deletes a specific artwork's comment.
// Validates IDs and removes the comment if found.
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
    res.status(500).send("Internal server error");
  }
};
