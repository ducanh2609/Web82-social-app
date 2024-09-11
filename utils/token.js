import jwt from 'jsonwebtoken';

const generateToken = (document, type) => {
    const getSecretKey = (type === 'AT' ? process.env.AT_SECRETKEY : process.env.RT_SECRETKEY);
    const getExp = (type === 'AT' ? 300 : 3600 * 24 * 7)
    const token = jwt.sign(document, getSecretKey, {
        // 60 = 1m
        expiresIn: getExp
    });
    return token;
};

const verifyToken = (token, type) => {
    const getSecretKey = (type === 'AT' ? process.env.AT_SECRETKEY : process.env.RT_SECRETKEY);
    const verifyToken = jwt.verify(token, getSecretKey);
    return verifyToken;
}
export {
    generateToken,
    verifyToken
}