const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    
    // Create a new object with only the properties you want to return
    const responseObject = {
      username: user.username,
      displayName: user.displayName,
      profilePic: user.profilePic
    };
    
    res.send(responseObject);
  } catch (error) {
    if (error.code === 11000) { // this is the error code for a duplication error in MongoDB
      res.status(400).send({ message: 'Username already exists' });
    } else {
      res.status(500).send(error);
    }
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('username displayName profilePic');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      // Create a new object with only the properties you want to return
      const responseObject = {
        username: user.username,
        displayName: user.displayName,
        profilePic: user.profilePic
      };
    
      res.send(responseObject);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getToken = async (req, res) => {
  try {
    const user = await User.findOne(req.body);
    if (!user) {
      res.sendStatus(401);
    } else {
      const token = jwt.sign({ userId: user.id }, 'SECRET_KEY');
      res.json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
