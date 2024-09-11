import UserModel from "../../models/user/index.js";
import bcryptHashing from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/token.js";

const userController = {
    signUp: async (req, res) => {
        try {
            const { email, password, userName } = req.body;
            const existedEmail = await UserModel.findOne({
                email
            });
            if (existedEmail) throw new Error('Email đã tồn tại!');
            const hash = bcryptHashing.hashingPassword(password);
            const newUser = await UserModel.create({
                email,
                password: hash.password,
                salt: hash.salt,
                userName
            });
            res.status(201).send({
                data: newUser,
                message: 'Đăng ký thành công',
                success: true
            })
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    },
    signIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const currentUser = await UserModel.findOne({
                email,
            });
            if (!currentUser) throw new Error('Sai tài khoản hoặc mật khẩu!');
            const checkPassword = bcryptHashing.verifyPassword(password, currentUser.password, currentUser.salt);
            if (!checkPassword) throw new Error('Sai tài khoản hoặc mật khẩu!');

            const getUser = {
                ...currentUser.toObject()
            };
            delete getUser.salt;
            delete getUser.password;
            const accessToken = generateToken({
                userId: getUser._id,
                email: getUser.email,
                typeToken: 'AT'
            }, 'AT');

            const refreshToken = generateToken({
                userId: getUser._id,
                email: getUser.email,
                typeToken: 'RT'
            }, 'RT');

            res.status(200).send({
                data: {
                    ...getUser,
                    accessToken,
                    refreshToken
                },
                message: 'Xác thực thông tin thành công!',
                success: true
            })
        } catch (error) {
            res.status(401).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const { id } = req.params;
            const currentUser = await UserModel.findById(id, {
                password: 0,
                salt: 0
            });
            res.status(200).send({
                data: currentUser,
                message: 'Thành công!',
                success: true
            })
        } catch (error) {
            res.status(401).send({
                data: null,
                message: error.message,
                error,
                success: false
            });
        }
    },
    findByIdAndUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { userName, password, avatar, gender } = req.body;
            const user = req.user;
            if (user.useId !== id) throw new Error('Bạn không thể thực hiện hành động!');
            await UserModel.findOneAndUpdate({
                _id: id,
            }, {
                userName,
                password,
                avatar,
                gender
            })
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                error,
                success: false
            });
        }
    }
};
export default userController;