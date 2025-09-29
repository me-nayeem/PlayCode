const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "local" || !this.provider;
    },
  },

  // OAuth fields
  googleId: String,
  githubId: String,
  provider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },
  avatar: String,
  isVerified: { type: Boolean, default: false },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
