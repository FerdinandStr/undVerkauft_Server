import mongoose from "mongoose"
import User from "./User"

const dbConnection = () => {
    return mongoose.connect(process.env.DATABASE_URL)
}

const models = { User }

export { dbConnection }
export default models
