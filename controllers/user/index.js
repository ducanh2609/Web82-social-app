import UserModel from "../../models/user/index.js";
import bcryptHashing from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/token.js";
import nodemailer from 'nodemailer'
import randomstring from "randomstring";
import dotenv from 'dotenv'
dotenv.config()

const option = {
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_SEND,
        pass: process.env.EMAIL_PASS,
    },
}
const transporter = nodemailer.createTransport(option)
transporter.verify(function (error, success) {
    // Nếu có lỗi.
    if (error) {
        console.log(error);
    } else { //Nếu thành công.
        console.log('Kết nối email thành công!');
    }
});

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
            var mail = {
                from: process.env.EMAIL_SEND, // Địa chỉ email của người gửi
                to: `${email}`, // Địa chỉ email của người gửi
                subject: 'Đăng kí tài khoản mới', // Tiêu đề mail
                text: 'Test nodemailer', // Nội dung mail dạng text
                html: `<h1>Chào ${userName}</h1>
                    <p>Cảm ơn bạn đã quan tâm đến trang web của chúng tôi</p>
                ` // Nội dung mail dạng html
            };
            transporter.sendMail(mail, (err, infor) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Email send:', infor.response)
                }
            })
            res.status(201).send({
                data: newUser,
                message: 'Một email đã được gửi đến bạn. Vui lòng kiểm tra!',
                success: true
            })
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
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
    forgetPassword: async (req, res) => {
        const { email } = req.body
        try {
            const existedEmail = await UserModel.findOne({ email })
            if (!existedEmail) {
                throw new Error('Email bạn nhập không tồn tại')
            }
            const resetPassword = randomstring.generate(10)
            const hash = bcryptHashing.hashingPassword(resetPassword);
            await UserModel.findOneAndUpdate({
                email,
            }, {
                password: hash.password,
                salt: hash.salt,
            })
            console.log('resetPassword', resetPassword)
            const resetPassMail = {
                from: process.env.EMAIL_SEND,
                to: `${email}`,
                subject: 'Reset password',
                text: 'Reset mật khẩu',
                html: `<h1>Chào ${existedEmail.userName}</h1>
                <p>Mật khẩu của bạn đã được chuyển thành ${resetPassword}</p>
                <p>Bạn có thể dùng mật khẩu này để đăng nhập lại</p>
                <p>Vui lòng click vào trang dưới để đăng nhập:</p>
                <a href="${process.env.CLIENT_PAGE}">Click here</a>
                `
            }
            transporter.sendMail(resetPassMail, (err, infor) => {
                if (err) throw new Error("Send email fail")
                console.log('Email send:', infor.response);
            })
            res.status(201).send({
                message: 'Mật khẩu mới của bạn đã được gửi vào mail. Vui lòng kiểm tra!',
                success: true
            });
        } catch (error) {
            res.status(401).send({
                message: error.message,
                success: false
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