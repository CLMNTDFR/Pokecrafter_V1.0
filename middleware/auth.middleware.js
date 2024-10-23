const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// Middleware to check if a user is logged in by verifying the JWT token from cookies.
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null; // If token verification fails, set user to null.
                res.cookie("jwt", "", { maxAge: 1 }); // Clear the JWT cookie.
                next();
            } else {
                // Find the user in the DB using the decoded token ID.
                let user = await UserModel.findById(decodedToken.id);
                if (user) {
                    res.locals.user = {
                        id: user._id, // Set the user ID and role in response locals if user is found.
                        role: user.role
                    };
                } else {
                    res.locals.user = null; // Set user to null if not found.
                }
                next();
            }
        });
    } else {
        res.locals.user = null; // No token found, set user to null.
        next();
    }
};

// Middleware to require authentication by verifying the JWT token and checking the user existence.
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' }); // Respond with 401 if token is invalid.
            } else {
                let user = await UserModel.findById(decodedToken.id);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized: User not found' }); // Respond with 401 if user not found.
                }
                res.locals.user = user; // Set the user in response locals for further use.
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized: Missing token' }); // Respond with 401 if token is missing.
    }
};
