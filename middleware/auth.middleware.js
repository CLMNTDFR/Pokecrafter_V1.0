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
              // Trouver l'utilisateur dans la base de données
              let user = await UserModel.findById(decodedToken.id);
              if (user) {
                  // Inclure le rôle et l'ID dans res.locals.user
                  res.locals.user = {
                      id: user._id,
                      role: user.role // Assurez-vous que user.role existe dans votre modèle
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
              console.log(err);
              return res.status(401).json({ message: 'Unauthorized: Invalid token' });
          } else {
              let user = await UserModel.findById(decodedToken.id);
              if (!user) {
                  return res.status(401).json({ message: 'Unauthorized: User not found' });
              }
              res.locals.user = user; // Mettre l'utilisateur dans res.locals
              next();
          }
      });
  } else {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }
};