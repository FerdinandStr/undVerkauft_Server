import { Router } from "express"
import Item from "../models/Item"

//* Path in main is /items
const router = Router()

//*get all Items or by SearchParam
router.get("/", (req, res, next) => {
    let query = {}
    const { name, activeOffer } = req.query
    if (name) {
        query = { ...query, name_lower: { $regex: ".*" + name.toLowerCase() + ".*" } }
    }
    if (activeOffer) {
        query = { ...query, offer: { $exists: true } }
    }

    Item.find(query)
        // .exists("offer")
        .then((result) => {
            return res.json(result)
        })
        .catch(next)
})

//*get Item by ID
router.get("/:itemId", (req, res, next) => {
    Item.findById(req.params.itemId)
        .then((result) => {
            return res.json(result)
        })
        .catch(next)
})

//*delete user
router.delete("/:itemId", (req, res, next) => {
    Item.deleteOne({ _id: req.params.itemId })
        .then((result) => res.json(result))
        .catch(next)
})

//*create item
router.post("/", (req, res, next) => {
    const itemBody = req.body
    const item = new Item({ ...itemBody, creationUser: req.user._id })
    item.save()
        .then((resItem) => {
            console.log("SAVED!", resItem)
            return res.status(201).send(resItem)
        })
        .catch(next)
})
//*update item
router.patch("/:itemId", (req, res, next) => {
    Item.updateOne({ _id: req.params.itemId }, { $set: req.body }) //holy shit
        .then((result) => res.json(result))
        .catch(next)
})

export default router
