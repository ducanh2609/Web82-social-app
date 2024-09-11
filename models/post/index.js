import mongoose from "mongoose";
import Collections from "../../database/collections.js";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    images: {
        type: [String]
    }
}, {
    timestamps: true
});

const PostModel = mongoose.model(Collections.POSTS, postSchema);
export default PostModel;