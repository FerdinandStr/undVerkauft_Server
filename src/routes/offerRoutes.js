import { Router } from "express"
import Item from "../models/Item"
import { Offer } from "../models/Offer"
const router = Router()

// create bid for offer (keep item unchanged!)
router.post("/:itemId/offer/bid", (req, res, next) => {
    Item.findById(req.params.itemId)
        .then((item) => {
            console.log("Item", item.offer)
            const userId = req.userId
            const bid = req.body.bid
            const lastBid = item.offer.bidList[item.offer.bidList.length - 1]
            if (lastBid && lastBid.bid < bid) {
                item.offer.bidList.push({ userId, bid, date: new Date() })
            } else {
                //TODO error
                console.log("ERROR", lastBid, bid)
            }
            console.log("Item", item.offer)

            item.save(item)
                .then(() => {
                    return res.send(item)
                })
                .catch(next)

            // return item.offer ? res.json(item.offer) : res.status(404).send("For this item exists no offer.")
        })
        .catch(next)

    // Item.updateOne({ _id: req.params.itemId }, { $set: { offer: { bidList: [req.body] } } }) //holy shit
    //     .then((result) => res.json(result))
    //     .catch(next)
})

//* get offer for Item ID
router.get("/:itemId/offer", (req, res, next) => {
    Item.findById(req.params.itemId)
        .then((item) => {
            return item.offer ? res.json(item.offer) : res.status(404).send("For this item exists no offer.")
        })
        .catch(next)
})

//create new Offer for Item
router.post("/:itemId/offer", (req, res, next) => {
    // const offer = new Offer({ startDate: req.body.startDate, endDate: req.body.endDate, askPrice: req.body.askPrice })
    const offer = new Offer(req.body)
    Item.updateOne({ _id: req.params.itemId }, { $set: { offer: offer } })
        .then((result) => res.json(result))
        .catch(next)
})

//create new Offer for Item
//update offer and keep item unchanged!
router.patch("/:itemId/offer", (req, res, next) => {
    Item.updateOne({ _id: req.params.itemId }, { $set: { offer: req.body } }) //holy shit :O
        .then((result) => res.json(result))
        .catch(next)
})

export default router
