import bcrypt from 'bcrypt';
const bcryptHashing = {
    hashingPassword: (password) => {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        return {
            password: hashPassword,
            salt
        }
    },
    verifyPassword: (password, hashPassword, salt) => {
        const hashingPassword = bcrypt.hashSync(password, salt);
        return hashingPassword === hashPassword;
    }
};
export default bcryptHashing;