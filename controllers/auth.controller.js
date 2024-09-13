const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: '3d'
    });
  };
  

module.exports.signUp = async (req, res) => {
    const { username, email, password_hash } = req.body;

    try {
        // Créer un nouvel utilisateur
        const user = await UserModel.create({ username, email, password_hash });
        // Envoyer une réponse de succès
        res.status(201).json({ user: user._id });
    } catch (err) {
        // Gérer les erreurs et envoyer une réponse
        console.error(err); // Optionnel: pour voir l'erreur dans la console
        res.status(500).send({ errors: [err.message] });
    }
};

module.exports.signIn = async (req, res) => {
    const { email, password_hash } = req.body;
  
    try {
      const user = await UserModel.login(email, password_hash);
      const token = createToken(user._id);

      res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge });
  
      res.status(200).json({ user: user._id });
    } catch (err) {
      res.status(400).json(err);
    }
  };

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
