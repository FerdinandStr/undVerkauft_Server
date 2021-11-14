import "dotenv/config"
import theSecret from "./userPass.js"
import cors from "cors"
import express from "express"
import models, { dbConnection } from "./models/index"
import { router as userRouter } from "./routes/userRoutes"
import errorController from "./middleware/errorController"

const { port, DATABASE_URL } = process.env
const eraseDatabaseOnSync = true

const server = express()
//Middlewares
server.use(express.json())
server.use("/users", userRouter)
// server.use(cors())

server.get("/port", (req, res) => {
    res.send(port)
})

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
    // .then((res) => {
    //     console.log("info", res)
    // })
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
