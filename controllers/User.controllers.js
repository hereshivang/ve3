import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User.model.js";

const JWT_SECRET = process.env.KEY;

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('Register', { message: 'Email already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(200);
    res.redirect('/login');
  } catch (error) {
    res.status(500).render('Register', { message: 'Failed to register user' });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200);
    res.cookie("token", token, {
      httpOnly: true, 
      maxAge: 24 * 60 * 60 * 1000
    });
    res.redirect('/home');

  } catch (error) {
    res.status(500).json({ message: "Failed to log in", error });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).redirect('/');
};
