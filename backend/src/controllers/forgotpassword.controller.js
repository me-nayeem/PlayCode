const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sendResetEmail } = require("../config/email");

const getForgotPasswordPage = (req, res) => {
  res.render("ForgotPassword/forgotpassword", {
    error: req.query.error,
    message: req.query.message,
  });
};

const postForgotPasswordPage = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.redirect(
        "/forgot-password?error=No account with that email exists"
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendResetEmail(user.email, resetToken, req);
      res.redirect("/forgot-password?message=Reset email sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.redirect(
        "/forgot-password?error=Email could not be sent. Please try again."
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.redirect(
      "/forgot-password?error=Something went wrong. Please try again."
    );
  }
};

const getResetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(
        "/forgot-password?error=Invalid or expired reset token"
      );
    }

    res.render("ForgotPassword/resetpassword", {
      token: token,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Reset password page error:", error);
    res.redirect("/forgot-password?error=Something went wrong");
  }
};

const postResetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.redirect(
        `/reset-password/${token}?error=Passwords do not match`
      );
    }

    if (password.length < 6) {
      return res.redirect(
        `/reset-password/${token}?error=Password must be at least 6 characters`
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(
        "/forgot-password?error=Invalid or expired reset token"
      );
    }

    const saltRounds = 12;
    user.password = await bcrypt.hash(password, saltRounds);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.redirect(
      "/login?message=Password reset successful. Please login with your new password."
    );
  } catch (error) {
    console.error("Password reset error:", error);
    res.redirect(
      `/reset-password/${req.params.token}?error=Something went wrong. Please try again.`
    );
  }
};

module.exports = {
  getForgotPasswordPage,
  postForgotPasswordPage,
  getResetPasswordPage,
  postResetPasswordPage,
};
