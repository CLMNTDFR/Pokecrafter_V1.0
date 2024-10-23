// Importing required modules: UserModel for interacting with user data,
// jwt for token creation, and utility functions for handling errors.
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors , signInErrors } = require('../utils/errors.utils');

// Define the maximum age for the JWT token (3 days in milliseconds).
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Function to create a JWT token with the user ID and expiration time.
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: '3d'
    });
}

// Function for user sign-up (registration). It handles the creation of a new user in the database.
module.exports.signUp = async (req, res) => {
    const {username, email, password_hash} = req.body
  
    try {
      // Create a new user with the provided username, email, and password hash.
      const user = await UserModel.create({username, email, password_hash });
      // Return the user's ID on successful creation.
      res.status(201).json({ user: user._id});
    }
    catch(err) {
      // In case of an error, return a customized error message.
      const errors = signUpErrors(err);
      res.status(200).send({ errors })
    }
}

// Function for user sign-in (login). It verifies user credentials and issues a JWT token upon success.
module.exports.signIn = async (req, res) => {
    const { email, password_hash } = req.body;
  
    try {
      // Log the user in by checking the provided email and password hash.
      const user = await UserModel.login(email, password_hash);
      
      // Create a JWT token for the authenticated user.
      const token = createToken(user._id);
      
      // Set the JWT token in an HTTP-only cookie to prevent client-side access.
      res.cookie('jwt', token, { httpOnly: true, maxAge });
      
      // Return the user's ID upon successful login.
      res.status(200).json({ user: user._id });
    } catch (err) {
      // In case of an error (e.g., wrong credentials), return a customized error message.
      const errors = signInErrors(err);
      res.status(400).json({ errors });
    }
}

// Function for user logout. It clears the JWT cookie to effectively log out the user.
module.exports.logout = (req, res) => {
    // Set the JWT cookie's max age to 1 millisecond, which removes it.
    res.cookie('jwt', '', { maxAge: 1 });
    // Redirect the user to the homepage after logout.
    res.redirect('/');
}
