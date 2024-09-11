import { Router } from "express";
import postController from "../../controllers/post/index.js";
import middlewares from "../../middlewares/index.js";

const PostRouter = Router();
PostRouter.post('', middlewares.verifyAccessToken, postController.createPost);
PostRouter.get('', middlewares.verifyAccessToken, postController.getAllPost);
PostRouter.get('/:id', middlewares.verifyAccessToken, postController.getPostById);
PostRouter.put('/:id', middlewares.verifyAccessToken, postController.findPostByIdAndUpdate);
PostRouter.delete('/:id', middlewares.verifyAccessToken, postController.findPostByIdAndDelete);

export default PostRouter;