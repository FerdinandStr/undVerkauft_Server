import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import { dbConnection } from "./models/index"
import userRouter from "./routes/userRoutes"
import authRouter from "./routes/authRoutes"
import itemRouter from "./routes/itemRoutes"
import offerRouter from "./routes/offerRoutes"
import fileRouter from "./routes/fileRoutes"
import errorController from "./middleware/errorController"
import { checkToken } from "./middleware/auth"

const { port, DATABASE_URL } = process.env

const server = express()
//Middlewares
server.use(cors({ allowedHeaders: "Content-Type", credentials: true, origin: true }))
server.use(express.json())
server.use(cookieParser())
server.use(express.static(__dirname + "/public"))

server.use("/users", authRouter)
server.use(checkToken)
server.use("/users", userRouter)
server.use("/items", itemRouter)
server.use("/items", offerRouter)
server.use("/files", fileRouter)
server.use(errorController)

dbConnection()
    .then(() => {
        console.log("Database connected on", DATABASE_URL)

        server.listen(port, () => {
            console.log("test server listening on ", port)
        })
        // if (eraseDatabaseOnSync) {
        //     return Promise.all([models.User.deleteMany({}), models.Message.deleteMany({})])
        // }
        // createUsersWithMessages()

        // server.listen(port, () => {
        //     console.log("test server listening on ", port, "connected with db", DATABASE_URL)
        // })
    })
    .catch((res) => {
        console.error("ERROR", res)
    })

// const createUsersWithMessages = async () => {
//     const user1 = new models.User({
//         username: "edvstraf",
//     })
//     const message1 = new models.Message({
//         text: "Mei erste Message",
//         user: user1.id,
//     })
//     await user1.save()
//     await message1.save()
// }
