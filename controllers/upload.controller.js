const UserModel = require("../models/user.model");
const fs = require("fs");
const path = require("path");

module.exports.uploadProfil = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw Error("No file uploaded"); // Handle case where no file is provided
        }

        const file = req.files.file;

        // Validate the file type (only jpg, png, jpeg are allowed)
        const validMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw Error("invalid file"); // Reject unsupported file types
        }

        // Ensure the file size does not exceed 500KB
        if (file.size > 500000) {
            throw Error("max size"); // Reject files that are too large
        }

        // Create the file name and set the path for where to store the image
        const fileName = req.body.name + ".jpg";
        const filePath = path.join(__dirname, "../client/public/img/uploads/profil", fileName);

        // Move the file to the specified directory
        file.mv(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            try {
                // Update the user document with the new picture path
                const updatedUser = await UserModel.findByIdAndUpdate(
                    req.body.userId,
                    { $set: { picture: "./img/uploads/profil/" + fileName } },
                    { new: true, upsert: true, setDefaultsOnInsert: true } // Ensure update is returned, upsert if not found
                );
                return res.status(200).json(updatedUser); // Return updated user info
            } catch (err) {
                return res.status(500).json({ message: err.message });
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err.message }); // Handle any validation or other errors
    }
};
