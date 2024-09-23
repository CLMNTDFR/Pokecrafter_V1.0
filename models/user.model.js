const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

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
        likes: {
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
        }
    },

    {
        timestamps: true,
    }
)

userSchema.pre("save", async function(next) {
    if (this.isModified('password_hash')) {
        const salt = await bcrypt.genSalt();
        this.password_hash = await bcrypt.hash(this.password_hash, salt);
    }
    next();
});

userSchema.statics.login = async function(email, password_hash) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password_hash, user.password_hash);
      if (auth) {
        return user;
      }
      throw Error('wrong password_hash');
    }
    throw Error('wrong email')
  };

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
