import { Router } from "express";
import UserRouter from "./user.js";
import PostRouter from "./post.js";
import CommentRouter from "./comment.js";
import RouterAuthentication from "./authentication.js";
const RouterV1 = Router();

RouterV1.use('/users', UserRouter);
RouterV1.use('/posts', PostRouter);
RouterV1.use('/comments', CommentRouter);
RouterV1.use('/authentication', RouterAuthentication);

export default RouterV1;