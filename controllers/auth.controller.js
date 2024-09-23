const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors , signInErrors } = require('../utils/errors.utils');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: '3d'
    });
  }
  

  module.exports.signUp = async (req, res) => {
    const {username, email, password_hash} = req.body
  
    try {
      const user = await UserModel.create({username, email, password_hash });
      res.status(201).json({ user: user._id});
    }
    catch(err) {
      const errors = signUpErrors(err);
      res.status(200).send({ errors })
    }
  }


  module.exports.signIn = async (req, res) => {
    const { email, password_hash } = req.body;
  
    try {
      // Recherche de l'utilisateur via son email et mot de passe haché
      const user = await UserModel.login(email, password_hash);
      
      // Génération du token d'authentification
      const token = createToken(user._id);
      
      // Création du cookie avec le token
      res.cookie('jwt', token, { httpOnly: true, maxAge });
      
      // Renvoie l'identifiant utilisateur
      res.status(200).json({ user: user._id });
    } catch (err) {
      // Gestion des erreurs de connexion
      const errors = signInErrors(err);
      
      // Changement du code d'erreur de 200 à 400 pour les erreurs
      res.status(400).json({ errors });
    }
  }
  

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
