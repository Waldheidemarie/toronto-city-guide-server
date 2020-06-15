const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.postLogin = async (req, res) => {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      res.status(400).json({msg: 'Make sure both fields are filled'})
    } 
  
    const user = await User.findOne({username: username})
    if (!user) {
      res.status(401).json({msg: 'Please enter a valid username'});
    }
    
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      res.status(401).json({msg: "Please enter a valid password"})
    }

  } catch (err) {
    res.status(500).json({msg: err.message})
  }
}

exports.postSignUp = async (req, res) => {
  try {
    const {username, email, password, confirmPassword} = req.body

    if (!username || !password || !confirmPassword || !email) {
      return res.status(400).json({msg: 'Not all fields have been filled in'});
    }
    if (password !== confirmPassword) {
      return res.status(400).json({msg: 'The passwords must match'});
    }
    
    const existingUser =  await User.findOne({ username: username })
    console.log(existingUser)
    if (existingUser) {
      return res.status(400).json({msg: 'An account with this user name already exists.'});
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username, 
      email, 
      password: hashedPassword});
    const savedUser = await user.save();
    
    res.json({msg: 'User created, please login', user: savedUser});
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}