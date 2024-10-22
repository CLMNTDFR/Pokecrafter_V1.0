const UserModel = require("../models/user.model");
const fs = require("fs");
const path = require("path");

module.exports.uploadProfil = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw Error("No file uploaded");
        }

        const file = req.files.file;

        const validMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw Error("invalid file");
        }

        if (file.size > 500000) {
            throw Error("max size");
        }

        const fileName = req.body.name + ".jpg";
        const filePath = path.join(__dirname, "../client/public/img/uploads/profil", fileName);

        file.mv(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ message: "File upload failed", error: err });
            }

            try {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    req.body.userId,
                    { $set: { picture: "./img/uploads/profil/" + fileName } },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
                return res.status(200).json(updatedUser);
            } catch (err) {
                return res.status(500).json({ message: err.message });
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
