import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

const User = mongoose.model('User', UserSchema);

/* export class UserRepository {
  static async create({ id, username, password }) {

    if (typeof username !== 'string') throw new Error('username must be a string');
    if (username.length < 3) throw new Error('username must be at least 3 characters long');

    if (typeof password !== 'string') throw new Error('password must be a string');
    if (password.length < 6) throw new Error('password must be at least 6 characters long');

    if (User.findOne({ username })) throw new Error('username already exists');

    const newUser = new User({ username, password });
    await newUser.save();

    return newUser;
  }
} */

export default User;