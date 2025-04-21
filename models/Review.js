import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  imdbID:  { type: String, required: true },
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true },
  content: { type: String, required: true },
  rating:  { type: Number, min: 1, max: 10 },

  helpful:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  unhelpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


export default mongoose.model('Review', ReviewSchema);