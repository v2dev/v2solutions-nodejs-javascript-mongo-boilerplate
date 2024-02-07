require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const User = require('../model/User');
const uuid = require('uuid');
const { sendEmail } = require('../utils/email/sendEmail');
const status = require('../utils/constant');
const { OAuth2Client } = require('google-auth-library');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(status.unauzorized)
        .json({ error: 'Invalid credentials' });
    }
    // if(!user.verified) {
    //     return res.status(status.unauzorized).json({ error: 'Please verify your email to login' });
    // }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (matchPassword) {
      res.json({
        message: 'Login successful',
        qrCodeUrl: user.qrCodeUrl,
      });
    } else {
      res.status(status.unauzorized).json({
        error: 'Invalid credentials',
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(status.internal_server).json({ error: 'Login failed' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;
    if (!email || !name || !password || !country) {
      return res.status(422).json({
        error: 'Please provide all the details to register an user',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ error: 'Email is already in used.' });
    }
    const mfaSecret = speakeasy.generateSecret({
      length: 20,
      name: 'employee-manager',
    });
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      mfaSecret: mfaSecret.base32,
    });

    await newUser.save();

    const qrCode = await QRCode.toDataURL(mfaSecret.otpauth_url);
    res.status(200).json({ newUser, qrCodeUrl: qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new user' });
  }
};

const validateEmail = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(status.unprocess)
        .json({ error: 'Verification is expired' });
    }
    const mfaSecret = speakeasy.generateSecret({
      length: 20,
      name: 'employee-manager',
    });
    user.isVerified = true;
    user.mfaSecret = mfaSecret.base32;
    let newUser = await user.save();
    console.log(newUser);
    const qrCode = await QRCode.toDataURL(mfaSecret.otpauth_url);
    res.status(status.success).json({ newUser, qrCodeUrl: qrCode });
  } catch (error) {
    res.status(status.internal_server).json({
      error: 'Failed to create a new user',
    });
  }
};

const mfaVerifyUser = async (req, res) => {
  try {
    const { email, mfaToken } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(status.unauzorized)
        .json({ error: 'Invalid credentials' });
    }
    const token = speakeasy.totp({
      secret: user.mfaSecret,
      encoding: 'base32',
    });
    console.log('Token is ', token);
    console.log(`mfaTOken is ${mfaToken} and secret is ${user.mfaSecret}`);
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaToken,
    });
    console.log('verified is ', verified);
    if (verified) {
      const jwtFToken = jwt.sign(
        { email: user.email },
        process.env.JWT_TOKEN,
        {
          expiresIn: '2h',
        },
      );
      console.log('token', jwtFToken);
      res.json({
        message: 'Verification successful',
        jwtToken: jwtFToken,
      });
    } else {
      res.status(status.unauzorized).json({ error: 'Invalid token' });
    }
  } catch (errorundefined) {
    console.error('Error during verification:', errorundefined);
    res.status(status.internal_server).json({
      error: 'Verification failed',
    });
  }
};
const forgetUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(status.unprocess)
        .json({ error: 'User not found' });
    }
    const resetToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();
    let token = uuid.v4();
    user.token = token;
    await user.save();
    const text = `You can use OTP to reset password :  <b>${resetToken}</b> or used link to reset password: <b>${process.env.BASE_URL}/reset-password/${token}</b>`;
    let params = {
      subject: 'Reset Password',
      text,
      email,
    };
    await sendEmail(params, res);
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(status.internal_server).json({
      error: 'Forgot password failed',
    });
  }
};

const resetUser = async (req, res) => {
  try {
    let user;
    const { otp, password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(status.unprocess)
        .json({ error: 'Passwords do not match' });
    }
    if (token) {
      if (!password || !confirmPassword) {
        return res
          .status(status.unprocess)
          .json({ error: 'Please provide a password' });
      }
      user = await User.findOne({ token });
      if (!user) {
        return res
          .status(status.unprocess)
          .json({ error: 'Invalid token' });
      }
      user = await User.findOne({ token });
      if (!user) {
        console.error('Token issue:', 'Invalid token'); 
        res.status(status.unprocess).json({ error: 'Invalid token' });
      }
    } else if (otp) {
      if (!otp || !password || !confirmPassword) {
        return res
          .status(status.bad_request)
          .json({ error: 'Please provide a password' });
      }
      user = await User.findOne({ resetPasswordToken: otp });
      if (!user || user.resetPasswordExpires < Date.now()) {
        return res
          .status(status.unprocess)
          .json({ error: 'Invalid or expired OTP' });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.token = undefined;
    await user.save();
    res.status(status.success).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(status.internal_server).json({
      error: 'Failed to reset password',
    });
  }
};

const verifyGoogleToken = async (req, res) => {
  const { token } = req.body;
  console.log(token);
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    if (!token) {
      res.status(status.bad_request).json({
        error: 'Please provide token',
      });
    }

    // Verify the Google access token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log(ticket);

    if (!ticket.getPayload().email) {
      return res
        .status(status.unauzorized)
        .json({ error: 'Invalid token' });
    }

    const payload = ticket.getPayload();
    // const userId = payload.sub;
    const userEmail = payload.email;

    //   Check if the user exists in your database, create if not (pseudo-code)
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      const newUser = new User({ email: userEmail });
      await newUser.save();
    }
    const jwtFToken = jwt.sign(
      { email: userEmail },
      process.env.JWT_TOKEN,
      {
        expiresIn: '2h',
      },
    );
    res.status(status.success).json({
      message: 'Verification successful',
      jwtToken: jwtFToken,
      success: true,
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(status.unauzorized).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  mfaVerifyUser,
  forgetUser,
  resetUser,
  validateEmail,
  verifyGoogleToken,
};
