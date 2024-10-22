const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie("jwt", "", { maxAge: 1 });
                next();
            } else {
                // Find the user in the DB
                let user = await UserModel.findById(decodedToken.id);
                if (user) {
                    res.locals.user = {
                        id: user._id,
                        role: user.role
                    };
                } else {
                    res.locals.user = null;
                }
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            } else {
                let user = await UserModel.findById(decodedToken.id);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized: User not found' });
                }
                res.locals.user = user;
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
};
