import express from 'express';
import mongoose from 'mongoose';
import User from './models/User.js'
import bcrypt from 'bcrypt';
import 'dotenv/config';

const app = express();
app.use(express.json());

const PORT = process.env.port ?? 3000;
const uri  = process.env.URL_BD;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {  
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
    console.log("You successfully disconnected to MongoDB!");
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  User.find()
    .then(Users => res.status(200).json(Users)); // responde 200 OK
})

app.post('/login', async (req, res) => {

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

})

app.post('/register', async (req, res) => {
  console.log(req.body);

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
})

app.post('/logout', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
})