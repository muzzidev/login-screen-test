import User from '../models/User.js'
import bcrypt from 'bcrypt';

const loginUser = async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  try {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) throw new Error('username doesnt exist');

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) throw new Error('password is invalid');

  res.status(200);
  res.send({id: user.id, username: user.username}); 
  } catch(error) {
    res.status(400).send( error.message )
  }
};

const registerUser = async (req, res) => {
  console.log('registerUser');
  try {
    const { username, password } = req.body;

    if (typeof username !== 'string') throw new Error('username must be a string');
    if (username.length < 3) throw new Error('username must be at least 3 characters long');

    if (typeof password !== 'string') throw new Error('password must be a string');
    if (password.length < 6) throw new Error('password must be at least 6 characters long');

    const userExists = await User.findOne({ username });
    if (userExists) throw new Error('username already exists');

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const newUser = new User({username, password: hashedPassword});

    await newUser.save()
    res.status(200).json({ msg: 'User created' });
  } catch (error) {
    res.status(400).send( {error: error.message} )
  }
}

const controller = { 
  loginUser,
  registerUser
}

export default controller;