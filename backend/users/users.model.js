// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
  roundsPlayed: { type: Number, default: 0 },
  level: { type: Number, default: 1 },

});

const User = mongoose.model('User', userSchema);

export default User;
