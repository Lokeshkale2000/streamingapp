import mongoose from "mongoose";

const uploadvideo = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }  // Use Date instead of String
});

export default mongoose.model('Video', uploadvideo);
