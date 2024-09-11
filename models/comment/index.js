import mongoose from "mongoose";
import Collections from "../../database/collections.js";

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.POSTS,
        required: true
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.USERS,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const CommentModel = mongoose.model(Collections.COMMENTS, commentSchema);
export default CommentModel;