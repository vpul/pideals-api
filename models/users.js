const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    avatar: { type: String, require: true, trim: true },
    isAdmin: { type: Boolean, default: false },
    username: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, require: true, trim: true },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// hash password before saving
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next(); // only hash the password if it has been modified (or is new)
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );
    return next();
  } catch (err) {
    return next(err);
  }
});

// check whether password matches with the one in the db
userSchema.methods.passwordMatch = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  delete this.toObject().password;
  return isMatch;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.email;
  // delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
