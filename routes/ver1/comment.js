import { Router } from "express";
import commentController from "../../controllers/comment/index.js";
import middlewares from "../../middlewares/index.js";
const CommentRouter = Router();
CommentRouter.get('', middlewares.verifyAccessToken, commentController.getCommentByListPostId);
CommentRouter.post('', middlewares.verifyAccessToken, commentController.createComment);
CommentRouter.delete('/:id', middlewares.verifyAccessToken, commentController.deleteCommentById);
CommentRouter.put('/:id', middlewares.verifyAccessToken, commentController.findByIdAndUpdate);

export default CommentRouter;