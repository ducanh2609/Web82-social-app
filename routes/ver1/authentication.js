import { Router } from "express";
import middlewares from "../../middlewares/index.js";
import { generateToken } from "../../utils/token.js";

const RouterAuthentication = Router();
RouterAuthentication.get('', middlewares.verifyRefreshToken, (req, res) => {
    try {
        const dataToken = {
            userId: req.user.userId,
            email: req.user.email,
            typeToken: 'AT'
        }
        const createAccessToken = generateToken(dataToken, 'AT');
        res.status(201).send({
            data: {
                accessToken: createAccessToken
            },
            success: true,
            message: 'Xác thực thành công!'
        })
    } catch (error) {
        res.status(403).send({
            data: null,
            message: error.message,
            success: false,
            error
        });
    }
});
export default RouterAuthentication;