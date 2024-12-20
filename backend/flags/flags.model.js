import { Schema, model } from 'mongoose';

const flagSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Sequential ID
  name: { type: String, required: true }, // Flag name
  country: { type: String, required: true }, // Associated country
  flag: { type: String, required: true }, // URL of the flag image
}, {
  timestamps: true, // Store the creation and update timestamps
});

export const flagModel = model('Flag', flagSchema);
