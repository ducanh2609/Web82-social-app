import mongoose from "mongoose";

const connectDatabase = () => {
    // config
    const connectString = process.env.CONNECT_STRING;
    return mongoose.connect(connectString);

}
export default connectDatabase;