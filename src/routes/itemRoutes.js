import e, { Router } from "express"
import Item from "../models/Item"

//* Path in main is /items
const router = Router()

const SORT_KEYS = ["asc", "desc"]

//*get Items by SearchParams
router.get("/", (req, res, next) => {
    const queryParams = req.query

    //deconstruct queryparams to dynamically create MongoDB Query with regex
    const crazyQueryObj = Object.keys(queryParams)
        .filter((key) => !SORT_KEYS.includes(key))
        .reduce((acc, key) => {
            let queryEl
            if (Array.isArray(queryParams[key])) {
                queryEl = queryParams[key].map((el) => ({ [key]: { $regex: el } }))
            } else {
                queryEl = [{ [key]: { $regex: queryParams[key] } }]
            }
            return [...acc, ...queryEl]
        }, [])
    const query = crazyQueryObj.length > 0 ? { $or: crazyQueryObj } : null

    //deconstruct queryparams to build MongoDB Sort Obj dynamically
    let sortObj = {}
    SORT_KEYS.forEach((sortKey) => {
        if (queryParams.hasOwnProperty(sortKey)) {
            if (Array.isArray(queryParams[sortKey])) {
                sortObj = { ...sortObj, ...queryParams[sortKey].reduce((acc, el) => ({ ...acc, [el]: sortKey }), {}) }
            } else {
                sortObj = { ...sortObj, [queryParams[sortKey]]: sortKey }
            }
        }
    })

    console.log("QUERY", query)
    console.log("SORT", sortObj)

    Item.find(query)
        .sort(sortObj)
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
    const { name, description, picList, offer } = req.body
    Item.updateOne({ _id: req.params.itemId }, { $set: { name, description, picList, offer } })
        .then((result) => res.status(201).send(result))
        .catch(next)
})

export default router
