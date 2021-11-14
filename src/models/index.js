import mongoose from "mongoose"
import User from "./User"
import Message from "./message"

const dbConnection = () => {
    return mongoose.connect(process.env.DATABASE_URL)
}

const models = { User, Message }

export { dbConnection }
export default models
