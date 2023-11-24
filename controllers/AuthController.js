/* eslint-disable no-undef */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const User = require('../model/User');
const Cryptr = require('cryptr');



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (matchPassword) {
            res.json({
                message: 'Login successful',
                qrCodeUrl: user.qrCodeUrl,
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.findOne({ email: userData.email });
        if (user) {
            return res
                .status(200)
                .json({ error: 'Email is already in used.' });
        }
        const mfaSecret = speakeasy.generateSecret({
            length: 20,
            name: 'employee-manager',
        });
        const newUser = new User({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            country: userData.country,
            mfaSecret: mfaSecret.base32,
        });

        await newUser.save();

        const qrCode = await QRCode.toDataURL(mfaSecret.otpauth_url);
        res.status(200).json({ newUser, qrCodeUrl: qrCode });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a new user' });
    }
};
const mfaVerifyUser = async (req, res) => {
    try {
        const { email, mfaToken } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
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
                    expiresIn: '20m',
                }
            );
            console.log('token', jwtFToken);
            res.json({
                message: 'Verification successful',
                jwtToken: jwtFToken,
            });
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (errorundefined) {
        console.error('Error during verification:', errorundefined);
        res.status(500).json({ error: 'Verification failed' });
    }
};
const forgetUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry

        await user.save();

        const cryptr = new Cryptr(process.env.EMAIL_AUTH_SECRET_KEY);
        let pass = cryptr.decrypt(process.env.EMAIL_ENCRYPTED);
      
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset',
            text: `Hi, Your OTP for password reset is: ${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({
                    error: 'Failed to send reset token',
                    errorMessage: error.message,
                });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Reset token sent to your email' });
        });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ error: 'Forgot password failed' });
    }
};
const resetUser = async (req, res) => {
    try {
        const { otp, password, confirmPassword } = req.body;

        if (!otp || !password || !confirmPassword) {
            return res
                .status(400)
                .json({ error: 'Please provide OTP and new password' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const user = await User.findOne({ resetPasswordToken: otp });

        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(404).json({ error: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

module.exports = {
    loginUser,
    registerUser,
    mfaVerifyUser,
    forgetUser,
    resetUser,
};
