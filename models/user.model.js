const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Define the user model

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            trim: true,
            unique: true,
        },
        password_hash: {
            type: String,
            required: true,
            minlength: 6,
            max: 1024,
        },
        picture: {
            type: String,
            default: "img/uploads/profil/random-user.png"
        },
        bio :{
            type: String,
            max: 1024,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        profile_picture_url: {
            type: String,
        },
        likes: {
            type: [String]
        },
        trophies: [{
            type: {
                type: String,
                enum: ['gold-trophy', 'silver-trophy', 'bronze-trophy', 'black-trophy'],
            },
            dateReceived: {
                type: Date,
                default: Date.now,
            }
        }],
        role: {
            type: String,
            enum: ['super-admin', 'admin', 'user'],
            default: 'user',
        }
    },
    {
        timestamps: true,
    }
);

// Middleware to hash the password before saving the user document
userSchema.pre("save", async function(next) {
    // Check if the password_hash field has been modified
    if (this.isModified('password_hash')) {
        const salt = await bcrypt.genSalt(); // Generate a salt for hashing
        this.password_hash = await bcrypt.hash(this.password_hash, salt); // Hash the password with the salt
    }
    next(); // Proceed to the next middleware or save operation
});

// Static method for user login, validating email and password
userSchema.statics.login = async function(email, password_hash) {
    const user = await this.findOne({ email }); // Find user by email
    if (user) {
      const auth = await bcrypt.compare(password_hash, user.password_hash); // Compare provided password with stored hash
      if (auth) {
        return user; // Return user if authentication is successful
      }
      throw Error('wrong password_hash'); // Throw error if password is incorrect
    }
    throw Error('wrong email'); // Throw error if user with email does not exist
};

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
