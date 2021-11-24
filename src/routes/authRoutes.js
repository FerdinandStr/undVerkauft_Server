import { Router } from "express"
import User from "../models/User"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const router = Router()

//* create new User
router.post("/register", (req, res, next) => {
    const { username, description, password, passwordConfirm } = req.body
    const user = new User({ username, email, password, passwordConfirm })

    // Create token

    user.save()
        .then((user) => {
            console.log("SAVED!", user)
            const token = createToken(user)
            return res.status(201).send(token)
        })
        .catch(next)
})

//* login User
router.post("/login", (req, res, next) => {
    const { login, password } = req.body

    if (!login || !password) {
        return res.status(400).send("E-Mail and password is required.")
    }

    User.findByLogin(login)
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        addCookieToken(user, res)

                        return res.status(200).send()
                    }
                    return res.status(400).send("Invalid credentials.")
                })
            } else {
                return res.status(404).send("User does not exist.")
            }
        })
        .catch(next)
})

function addCookieToken(user, res) {
    const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "2h" })
    const options = {
        path: "/",
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24,
    }
    res.cookie("x-access-token", token, options)
}

export default router
