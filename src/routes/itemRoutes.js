import { Router } from "express"
import Item from "../models/Item"
import { Offer } from "../models/Offer"

//* Path in main is /items
const router = Router()

const SORT_KEYS = ["asc", "desc"]
const SPECIAL_KEYS = ["offerActive"]

//*get Items by SearchParams
router.get("/", (req, res, next) => {
    const queryParams = req.query
    console.log(queryParams)

    //deconstruct queryparams to dynamically create MongoDB Query with regex
    const crazyQueryObj = Object.keys(queryParams)
        .filter((key) => !SORT_KEYS.includes(key) && !SPECIAL_KEYS.includes(key))
        .reduce((acc, key) => {
            let queryValue = queryParams[key]

            //check if multiple elements are on this key
            if (Array.isArray(queryValue)) {
                //add with regex if searchfield input
                if (key === "name_lower") {
                    queryValue = queryValue.map((el) => ({ [key]: { $regex: el } }))
                } else {
                    queryValue = queryValue.map((el) => ({ [key]: el }))
                }
            } else {
                //add with regex if searchfield input
                if (key === "name_lower") {
                    queryValue = [{ [key]: { $regex: queryValue } }]
                } else {
                    queryValue = [{ [key]: queryValue }]
                }
            }
            return [...acc, ...queryValue]
        }, [])

    let query = crazyQueryObj.length > 0 ? { $or: crazyQueryObj } : null

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

    //add special querys... this will add any custom mongoDB query send by the frontend to the select! (at the moment only built for offerActive; needs refactor)
    if (Object.keys(queryParams).includes("offerActive")) {
        try {
            console.log("CustomDateQuery!", JSON.parse(decodeURIComponent(queryParams["offerActive"])))
            query = { ...query, "offer.endDate": JSON.parse(decodeURIComponent(queryParams["offerActive"])) }
        } catch (e) {}
    }

    console.log("QUERY", query)
    console.log("SORT", sortObj)

    Item.find(query)
        .sort(sortObj)
        .populate("offer.bidList.userId")
        .then((result) => {
            return res.json(result)
        })
        .catch(next)
})

//*get Item by ID
router.get("/:itemId", (req, res, next) => {
    Item.findById(req.params.itemId)
        .populate("offer.bidList.userId")
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
    const { offer } = itemBody

    //Test if one of the dates is missing (both dates missing is allowed!)
    if ((offer.startDate && !offer.endDate) || (!offer.startDate && offer.endDate)) {
        next(new Error("Start- und Enddatum benötigt"))
    }

    const item = new Item({ ...itemBody, creationUser: req.user._id })
    item.save()
        .then((resItem) => {
            console.log("SAVED!", resItem)
            return res.status(201).send(resItem)
        })
        .catch(next)
})

//*update item
router.patch("/:itemId", async (req, res, next) => {
    const { itemId } = req.params
    const { name, description, picList, offer } = req.body

    //Test if one of the dates is missing (both dates missing is allowed!)
    if ((offer.startDate && !offer.endDate) || (!offer.startDate && offer.endDate)) {
        next(new Error("Start- und Enddatum benötigt"))
    }

    try {
        //Check if Offer has already started => abort update
        const oldItem = await Item.findById(itemId)
        if (oldItem.offer.startDate && oldItem.offer.startDate < new Date()) {
            next(new Error("Die Auktion läuft bereits und der Artikel kann nicht mehr geändert werden!"))
        }

        Item.updateOne({ _id: itemId }, { $set: { name, description, picList, offer } })
            .then((result) => res.status(201).send(result))
            .catch(next)
    } catch (e) {
        next(e)
    }
})

export default router
