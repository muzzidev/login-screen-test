import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { defaultHeaders } from './config.js';
import userRouter from './routers/userRouter.js';

const app = express();
app.use(express.json());
app.use(defaultHeaders());

const PORT = 3000;
const uri  = process.env.URL_DB;
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
    console.log("YOU HAVE BEEN DISCONNECTED, YOU FOOL!");

  }
}
run().catch(console.dir);

app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
})