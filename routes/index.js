import { Router } from "express";
import RouterV1 from "./ver1/index.js";
const RootRouter = Router();

RootRouter.use('/v1', RouterV1);
export default RootRouter;