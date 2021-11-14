import { Router } from "express"
import User from "../models/User"

const router = Router()

//*get all Users
router.get("/", (req, res) => {
    User.find()
        .then((result) => {
            return res.json(result)
        })
        .catch((error) => {
            return res.json({ message: error })
        })
})
//*ind user by ID
router.get("/:userId", (req, res, next) => {
    User.findById(req.params.userId)
        .then((result) => {
            return res.json(result)
        })
        .catch(next)
})
//*delete user
router.delete("/:userId", (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .then((result) => res.json(result))
        .catch(next)
})

//*patch user
//patch like put but for single elements (put "always" update/overwrite whole element)
router.patch("/:userId", (req, res, next) => {
    User.updateOne({ _id: req.params.userId }, { $set: { email: req.body.email } }) //how to validate?
        .then((result) => res.json(result))
        .catch(next)
})

//*create new User
router.post("/", (req, res, next) => {
    const { username, email, password, passwordConfirm } = req.body
    const user = new User({ username, email, password, passwordConfirm })

    user.save()
        .then((x) => {
            console.log("SAVED!", x)
            return res.json(x)
        })
        .catch(next)
})

router.put("/:userId", (req, res) => {
    return res.send(`PUT HTTP method on user/${req.params.userId} resource`)
})

router.delete("/:userId", (req, res) => {
    return res.send(`DELETE HTTP method on user/${req.params.userId} resource`)
})

export { router }
